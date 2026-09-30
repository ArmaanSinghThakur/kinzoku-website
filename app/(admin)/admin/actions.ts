"use server";

import { isAPIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { admin as t } from "@/content/admin";
import { rfqStatuses } from "@/content/rfq-status";
import { requireStaff } from "@/lib/admin-guard";
import { auth } from "@/lib/auth";
import { db, isUniqueViolation } from "@/lib/db";
import { disconnectStaff, liveEmit } from "@/lib/live/emit";
import { rooms, type StatusEvent } from "@/lib/live/protocol";
import type { RfqStatus } from "@/lib/generated/prisma/client";
import { createStaff, endStaffSessions, resetStaffPassword, setStaffActive } from "@/lib/staff";

// The admin area's actions. Each checks the login itself: the pages hiding a button is never the
// only protection (Next.js also refuses actions sent from other sites).

const text = (form: FormData, name: string) => String(form.get(name) ?? "").trim();
const isStatus = (value: string): value is RfqStatus => value in rfqStatuses;

export async function logOut() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  await auth.api.signOut({ headers: requestHeaders });
  if (session) disconnectStaff(session.user.id);
  redirect("/admin/login");
}

/**
 * Moves a request to another status and records who did it. Applies only if the request still
 * has the status the staff member saw, so two people clicking at once can't overwrite each other.
 */
export async function setRfqStatus(form: FormData) {
  const staff = await requireStaff();
  const reference = text(form, "reference");
  const from = text(form, "from");
  const to = text(form, "to");
  if (!isStatus(from) || !isStatus(to) || from === to) return;
  const rfqId = await db.$transaction(async (tx) => {
    const { count } = await tx.rfq.updateMany({ where: { reference, status: from }, data: { status: to } });
    if (count === 0) return null;
    const rfq = await tx.rfq.findUniqueOrThrow({ where: { reference }, select: { id: true } });
    await tx.rfqStatusChange.create({ data: { rfqId: rfq.id, fromStatus: from, toStatus: to, changedById: staff.id } });
    return rfq.id;
  });
  if (rfqId) {
    // The buyer's status page and other staff update at once (plan: "request status").
    const event: StatusEvent = { reference, status: to };
    liveEmit(rooms.rfq(rfqId), "status", event);
    liveEmit(rooms.staff, "rfq:status", event);
  }
  revalidatePath(`/admin/requests/${reference}`);
}

/** Links a request to a client company (existing or new), which keeps it 7 years instead of 12 months. */
export async function markAsClient(form: FormData) {
  await requireStaff();
  const reference = text(form, "reference");
  const companyId = text(form, "companyId");
  const name = text(form, "name").slice(0, 200);
  const country = text(form, "country").slice(0, 100);
  const vatNumber = text(form, "vat").slice(0, 30) || null;
  const since = new Date(text(form, "since"));
  if (!companyId && (!name || !country || Number.isNaN(since.getTime()))) return;
  await db.$transaction(async (tx) => {
    const rfq = await tx.rfq.findUnique({ where: { reference }, select: { id: true, companyId: true } });
    if (!rfq || rfq.companyId) return;
    const id = companyId
      ? (await tx.company.findUniqueOrThrow({ where: { id: companyId }, select: { id: true } })).id
      : (await tx.company.create({ data: { name, country, vatNumber, clientSince: since } })).id;
    await tx.rfq.update({ where: { id: rfq.id }, data: { companyId: id } });
  });
  revalidatePath(`/admin/requests/${reference}`);
}

export type StaffActionState = { message?: string; password?: string; error?: string } | null;

export async function addStaff(_: StaffActionState, form: FormData): Promise<StaffActionState> {
  await requireStaff({ role: "admin" });
  const name = text(form, "name").slice(0, 200);
  const email = text(form, "email").toLowerCase();
  const role = text(form, "role") === "admin" ? "admin" : "sales";
  if (!name || !email) return { error: t.errors.required };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return { error: t.errors.email };
  try {
    const password = await createStaff({ name, email, role });
    revalidatePath("/admin/staff");
    return { message: t.staff.created(email), password };
  } catch (error) {
    if (isUniqueViolation(error)) return { error: t.staff.exists };
    throw error;
  }
}

/** Password reset, logging out everywhere, switching off and on. Never on your own account. */
export async function staffAction(_: StaffActionState, form: FormData): Promise<StaffActionState> {
  const me = await requireStaff({ role: "admin" });
  const id = text(form, "id");
  if (id === me.id) return { error: t.staff.notYourself };
  switch (text(form, "action")) {
    case "reset":
      return { message: t.staff.newPassword, password: await resetStaffPassword(id) };
    case "end":
      await endStaffSessions(id);
      return { message: t.staff.sessionsEnded };
    case "off":
      await setStaffActive(id, false);
      break;
    case "on":
      await setStaffActive(id, true);
      break;
  }
  revalidatePath("/admin/staff");
  return null;
}

export type PasswordState = { error?: string; done?: boolean } | null;

/** Changes your own password (the current one is required) and logs out your other devices. */
export async function changePassword(_: PasswordState, form: FormData): Promise<PasswordState> {
  const me = await requireStaff({ passwordChange: true });
  const current = String(form.get("current") ?? "");
  const next = String(form.get("new") ?? "");
  if (next.length < 12) return { error: t.account.tooShort };
  if (next.length > 128) return { error: t.account.tooLong };
  if (next !== String(form.get("confirm") ?? "")) return { error: t.account.mismatch };
  if (next === current) return { error: t.account.same };
  const requestHeaders = await headers();
  try {
    await auth.api.changePassword({ body: { currentPassword: current, newPassword: next }, headers: requestHeaders });
  } catch (error) {
    if (isAPIError(error)) return { error: t.account.wrongCurrent };
    throw error;
  }
  // Log out every other device, keeping this session (and its cookie) as it is.
  const session = await auth.api.getSession({ headers: requestHeaders });
  await db.$transaction([
    db.staffSession.deleteMany({ where: { userId: me.id, NOT: { id: session?.session.id } } }),
    db.staffUser.update({ where: { id: me.id }, data: { mustChangePassword: false } }),
  ]);
  disconnectStaff(me.id); // this page reconnects by itself with its still-valid login
  if (me.mustChangePassword) redirect("/admin");
  return { done: true };
}
