import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "./access-policy";
import { canAccessAdmin } from "./access";

export async function currentAdminAuthorized(): Promise<boolean> {
  const accessToken = (await cookies()).get(ADMIN_COOKIE)?.value;
  return canAccessAdmin(accessToken);
}
