import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { ADMIN_COOKIE, ADMIN_COOKIE_PATH, isAdminProtectedPath, isValidAccessToken, sessionCookieLifetime } from '../../lib/admin/access-policy.ts';
const read = path => readFileSync(new URL(`../../${path}`, import.meta.url),'utf8');

test('admin routes fail closed by default and public routes stay outside boundary', () => {
  for (const path of ['/admin','/admin/catalog','/admin/catalog/edit','/admin/any/deep/path']) assert.equal(isAdminProtectedPath(path),true,path);
  for (const path of ['/','/busca','/produto/x','/carrinho','/admin/login','/admin/session','/admin/logout','/administrator']) assert.equal(isAdminProtectedPath(path),false,path);
});
test('tokens must be JWT-shaped and bounded', () => {
  assert.equal(isValidAccessToken(undefined),false);
  assert.equal(isValidAccessToken(''),false);
  assert.equal(isValidAccessToken('Bearer abc.def.ghi'),false);
  assert.equal(isValidAccessToken('abc.def.ghi'),true);
  assert.equal(isValidAccessToken('a.'.concat('b'.repeat(4096),'.c')),false);
});
test('cookie is scoped and never survives access JWT expiration', () => {
  assert.equal(ADMIN_COOKIE,'vektua_admin_access');
  assert.equal(ADMIN_COOKIE_PATH,'/admin');
  assert.equal(sessionCookieLifetime(undefined,100),0);
  assert.equal(sessionCookieLifetime(99,100),0);
  assert.equal(sessionCookieLifetime(110,100),10);
  assert.equal(sessionCookieLifetime(10_000,100),3600);
});
test('dynamic no-cache route and server-side authorization safeguards exist', () => {
  const proxy=read('proxy.ts');
  const access=read('lib/admin/access.ts');
  const admin=read('app/admin/page.tsx');
  const login=read('app/admin/login/page.tsx');
  const logout=read('app/admin/logout/route.ts');
  const session=read('app/admin/session/route.ts');
  assert.match(proxy,/matcher:\s*\["\/admin\/:path\*"\]/);
  assert.match(proxy,/await canAccessAdmin\(/);
  assert.match(proxy,/Cache-Control["'],\s*["']private, no-store/);
  assert.match(access,/\.auth\.getUser\(accessToken\)/);
  assert.match(access,/rpc\/can_access_admin/);
  assert.match(access,/cache:\s*"no-store"/);
  assert.match(access,/return false;\s*}\s*$/m);
  for (const src of [admin,login,logout,session]) assert.match(src,/force-dynamic/);
  assert.match(admin,/await currentAdminAuthorized\(\)/);
  assert.match(session,/await canAccessAdmin\(token\)/);
  assert.match(session,/httpOnly:true/);
  assert.match(session,/path:ADMIN_COOKIE_PATH/);
  assert.match(logout,/method:\s*"POST"/);
  assert.match(logout,/maxAge:0/);
  assert.doesNotMatch(proxy+access+session+logout,/service_role|sb_secret_|raw_user_meta_data/);
});
test('migration is narrow, prevents direct access to private role records', () => {
  const sql=read('supabase/migrations/20260922212956_sb_014_admin_auth_admission.sql');
  assert.match(sql,/auth\.sessions/);
  assert.match(sql,/is_active IS TRUE/);
  assert.match(sql,/REVOKE ALL ON FUNCTION public\.can_access_admin\(\) FROM PUBLIC, anon, authenticated/);
  assert.match(sql,/GRANT EXECUTE ON FUNCTION public\.can_access_admin\(\) TO authenticated/);
  assert.doesNotMatch(sql,/GRANT (?:SELECT|INSERT|UPDATE|DELETE) ON .*admin_role_assignments/);
});
