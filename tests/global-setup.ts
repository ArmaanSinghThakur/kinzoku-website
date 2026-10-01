import { clearMail, connectDb, mailpit, removeTestData } from "./helpers";

// Before the tests: the local services must be running, and leftovers of an interrupted earlier
// run are removed.
export default async function globalSetup() {
  const mailOk = await fetch(`${mailpit}/info`).then((r) => r.ok, () => false);
  let db;
  try {
    db = await connectDb();
  } catch {
    db = null;
  }
  if (!mailOk || !db) {
    throw new Error("The local services are not running. Start them with: npm run services:up");
  }
  await removeTestData(db);
  await db.end();
  await clearMail();
}
