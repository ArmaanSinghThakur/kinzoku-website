import { randomUUID } from "node:crypto";
import { generateRandomString, hashPassword } from "better-auth/crypto";
import { db } from "@/lib/db";
import type { StaffRole } from "@/lib/generated/prisma/client";
import { disconnectStaff } from "@/lib/live/emit";

// Staff accounts, managed by admins (admin area and `npm run staff:add`). There is no public
// sign-up. New accounts and reset passwords get a temporary password that is shown once; the
// person must choose their own at the next login. Passwords are hashed the way Better Auth
// checks them at login.

/** 16 random letters and digits in groups of 4, e.g. "k7Tq-9mWx-a2Lp-Vr8d". */
function temporaryPassword() {
  return generateRandomString(16, "a-z", "A-Z", "0-9").match(/.{4}/g)!.join("-");
}

export async function createStaff({ name, email, role }: { name: string; email: string; role: StaffRole }) {
  const id = randomUUID();
  const password = temporaryPassword();
  await db.staffUser.create({
    data: {
      id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      accounts: { create: { providerId: "credential", accountId: id, password: await hashPassword(password) } },
    },
  });
  return password;
}

/** New temporary password; the person is logged out everywhere. */
export async function resetStaffPassword(id: string) {
  const password = temporaryPassword();
  await db.$transaction([
    db.staffAccount.updateMany({ where: { userId: id, providerId: "credential" }, data: { password: await hashPassword(password) } }),
    db.staffUser.update({ where: { id }, data: { mustChangePassword: true } }),
    db.staffSession.deleteMany({ where: { userId: id } }),
  ]);
  disconnectStaff(id);
  return password;
}

/** Switching an account off also logs the person out at once. */
export async function setStaffActive(id: string, active: boolean) {
  await db.$transaction([
    db.staffUser.update({ where: { id }, data: { active } }),
    ...(active ? [] : [db.staffSession.deleteMany({ where: { userId: id } })]),
  ]);
  if (!active) disconnectStaff(id);
}

export async function endStaffSessions(id: string) {
  await db.staffSession.deleteMany({ where: { userId: id } });
  disconnectStaff(id);
}
