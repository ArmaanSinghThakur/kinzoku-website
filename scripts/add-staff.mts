// Adds a staff member to the admin area (the first admin, or anyone later):
//   npm run staff:add -- --name "Jane Doe" --email jane@kinzokutrade.com --role admin
// Prints a temporary password once; the person chooses their own at the first login.
import { parseArgs } from "node:util";
import { db, isUniqueViolation } from "@/lib/db";
import { mailSettings } from "@/lib/mailer";
import { createStaff } from "@/lib/staff";

const { values } = parseArgs({
  options: { name: { type: "string" }, email: { type: "string" }, role: { type: "string", default: "sales" } },
});
const { name, email, role } = values;
if (!name || !email || !/^\S+@\S+\.\S+$/.test(email) || (role !== "admin" && role !== "sales")) {
  console.error('Usage: npm run staff:add -- --name "Jane Doe" --email jane@kinzokutrade.com [--role admin|sales]');
  process.exit(1);
}

try {
  const password = await createStaff({ name, email, role });
  console.log(`Added ${email.toLowerCase()} (${role}).`);
  console.log(`Temporary password (shown only now): ${password}`);
  console.log(`They choose their own password at the first login: ${mailSettings.siteUrl}/admin/login`);
} catch (error) {
  console.error(isUniqueViolation(error) ? `${email} already has an account.` : error);
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
