import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type StaffMember = { id: string; name: string; email: string; role: "admin" | "sales"; mustChangePassword: boolean };

/**
 * The logged-in staff member. Every admin page, action and download calls this on the server
 * (hiding a button is never the only check). Not logged in → login page; temporary password →
 * account page to choose one; `admin` pages → not found for sales staff.
 */
export async function requireStaff(options: { role?: "admin"; passwordChange?: boolean } = {}): Promise<StaffMember> {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  if (!user || !user.active) redirect("/admin/login");
  if (user.mustChangePassword && !options.passwordChange) redirect("/admin/account");
  const role = user.role === "admin" ? "admin" : "sales";
  if (options.role === "admin" && role !== "admin") notFound();
  return { id: user.id, name: user.name, email: user.email, role, mustChangePassword: Boolean(user.mustChangePassword) };
}
