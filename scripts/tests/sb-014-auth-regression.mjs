import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { revokeSupabaseSession } from '../../lib/admin/revoke-session.ts';

const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const token = 'example.access.token'; // Dummy three-segment string, NEVER a live JWT.
const url = 'https://example.supabase.co';
const key = 'sb_publishable_test_only';

test('invalid/missing token never calls Auth logout', async () => {
  let calls = 0;
  const transport = async () => { calls++; return { ok: true }; };
  assert.equal(await revokeSupabaseSession(undefined, url, key, transport), false);
  assert.equal(await revokeSupabaseSession('not-a-jwt', url, key, transport), false);
  assert.equal(await revokeSupabaseSession('a.'.concat('b'.repeat(4096), '.c'), url, key, transport), false);
  assert.equal(calls, 0);
});

test('refused login logout targets ONLY newly issued local session and checks HTTP outcome', async () => {
  let calls = 0;
  const transport = async (endpoint, options) => {
    calls++;
    assert.equal(endpoint, `${url}/auth/v1/logout?scope=local`);
    assert.equal(options.method, 'POST');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.headers.apikey, key);
    assert.equal(options.headers.Authorization, `Bearer ${token}`);
    return { ok: true, status: 204 };
  };
  assert.equal(await revokeSupabaseSession(token, url, key, transport), true);
  assert.equal(calls, 1);
});

test('Auth HTTP refusal is NOT reported as successful revocation', async () => {
  assert.equal(await revokeSupabaseSession(token, url, key, async () => ({ ok: false, status: 401 })), false);
});

test('Auth network failure is NOT reported as successful revocation', async () => {
  assert.equal(await revokeSupabaseSession(token, url, key, async () => { throw new Error('simulated network failure'); }), false);
});

test('A06 structural guard: refused successful Auth login invokes cleanup and clears stale cookie', () => {
  const session = read('app/admin/session/route.ts');
  assert.match(session, /issuedToken\s*=\s*data\.session\?\.access_token/);
  assert.match(session, /await revokeRejectedSession\(issuedToken\);\s*return deny\(request\)/);
  assert.match(session, /response\.cookies\.set\(ADMIN_COOKIE,\s*"",\s*\{/);
  assert.match(session, /maxAge:\s*0/);
  assert.match(session, /if \(error \|\| !issuedToken \|\| expires <= 0 \|\| !\(await canAccessAdmin\(issuedToken\)\)\)/);
});

test('A08 structural guard: logout checks remote result and clears cookie; denied proxy clears stale cookie', () => {
  const logout = read('app/admin/logout/route.ts');
  const proxy = read('proxy.ts');
  assert.match(logout, /remotelyRevoked\s*=\s*await revokeSupabaseSession\(/);
  assert.match(logout, /if \(!remotelyRevoked\)/);
  assert.match(logout, /scope=local|revokeSupabaseSession/);
  assert.match(logout, /response\.cookies\.set\(ADMIN_COOKIE,\s*"",/);
  assert.match(proxy, /protectedPath && !allowed && request\.cookies\.has\(ADMIN_COOKIE\)/);
  assert.match(proxy, /response\.cookies\.set\(ADMIN_COOKIE,\s*"",/);
});

test('A09 structural guard: login positive/negative, logout, proxy cannot cache admin responses', () => {
  for (const path of ['app/admin/session/route.ts', 'app/admin/logout/route.ts', 'proxy.ts']) {
    const src = read(path);
    assert.match(src, /private, no-store/);
    assert.match(src, /Vary/);
  }
  const login = read('app/admin/session/route.ts');
  assert.match(login, /const response = noStore\(NextResponse\.redirect\(new URL\("\/admin", request\.url\), 303\)\)/);
  assert.match(login, /httpOnly:\s*true/);
  assert.match(login, /sameSite:\s*"strict"/);
  assert.match(login, /path:\s*ADMIN_COOKIE_PATH/);
});

test('revocation epoch: reactivation cannot revive sessions minted before latest role change', () => {
  const sql = read('supabase/migrations/20260923000434_sb_014_revoke_admin_sessions_on_role_change.sql');
  assert.match(sql, /s\.created_at > a\.updated_at/);
  assert.match(sql, /a\.is_active IS TRUE/);
  assert.match(sql, /JOIN auth\.sessions s/);
  assert.match(sql, /REVOKE ALL ON FUNCTION public\.can_access_admin\(\) FROM PUBLIC, anon, authenticated/);
  assert.match(sql, /GRANT EXECUTE ON FUNCTION public\.can_access_admin\(\) TO authenticated/);
  assert.doesNotMatch(sql, /(?:DELETE FROM|UPDATE) auth\.sessions/i);
});
