// Runs the nightly clean-up now (it also runs by itself every night at 03:00 Amsterdam time):
//   npm run retention:now                 delete what the Privacy Policy says must go
//   npm run retention:now -- --dry-run    only count it
import { db } from "@/lib/db";
import { runRetention } from "@/lib/retention";

const dryRun = process.argv.includes("--dry-run");
try {
  const summary = await runRetention({ dryRun });
  console.log(dryRun ? "Would delete:" : "Deleted:", JSON.stringify(summary));
} finally {
  await db.$disconnect();
}
