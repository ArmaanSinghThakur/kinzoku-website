// Database check (Step 14). Run while the local database is up:  npm run db:check
// Checks the migrations and tables, then goes through a request's life with test data (emails end
// in .invalid, references use the years 2098/2099) and removes all of it again at the end, also
// when a check fails. Exits 1 on any failure.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { hashStatusToken, newStatusToken, nextRfqReference } from "@/lib/rfq";

const TEST_EMAIL = "@db-check.invalid";
const TEST_YEARS = [2098, 2099];
const TABLES = [
  "staff_users", "companies", "rfqs", "rfq_reference_counters", "rfq_files",
  "rfq_status_history", "chat_messages", "cbam_estimates",
];

let failed = false;
async function check(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failed = true;
    console.log(`  ✗ ${name}\n    ${error instanceof Error ? error.message : error}`);
  }
}

/** The Prisma error code a promise fails with (P2002 duplicate, P2003 still referenced). */
async function errorCode(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) return error.code;
    throw error;
  }
  return "no error";
}

async function cleanUp() {
  await db.rfq.deleteMany({ where: { email: { endsWith: TEST_EMAIL } } });
  await db.company.deleteMany({ where: { name: { startsWith: "DB check" } } });
  await db.staffUser.deleteMany({ where: { email: { endsWith: TEST_EMAIL } } });
  await db.cbamEstimate.deleteMany({ where: { email: { endsWith: TEST_EMAIL } } });
  await db.rfqCounter.deleteMany({ where: { year: { in: TEST_YEARS } } });
}

async function main() {
  console.log("Database check");
  await cleanUp(); // leftovers from an interrupted earlier run

  await check("all migrations applied", async () => {
    const rows = await db.$queryRaw<{ migration_name: string; finished_at: Date | null; rolled_back_at: Date | null }[]>`
      SELECT migration_name, finished_at, rolled_back_at FROM _prisma_migrations`;
    assert.ok(rows.length > 0, "no migrations in the database");
    const unfinished = rows.filter((r) => !r.finished_at || r.rolled_back_at).map((r) => r.migration_name);
    assert.deepEqual(unfinished, [], "unfinished migrations");
  });

  await check(`all ${TABLES.length} tables exist`, async () => {
    const rows = await db.$queryRaw<{ table_name: string }[]>`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    const found = new Set(rows.map((r) => r.table_name));
    assert.deepEqual(TABLES.filter((t) => !found.has(t)), [], "missing tables");
  });

  const staff = await db.staffUser.create({
    data: { email: `sales${TEST_EMAIL}`, name: "DB check staff", passwordHash: "not-a-real-hash" },
  });
  const company = await db.company.create({
    data: { name: "DB check client", country: "Netherlands", clientSince: new Date("2026-01-01") },
  });
  const { token, hash } = newStatusToken();

  // A request and its first history entry are saved together, or not at all.
  const rfq = await db.$transaction(async (tx) => {
    const created = await tx.rfq.create({
      data: {
        reference: await nextRfqReference(tx, 2099),
        type: "nails",
        companyName: "DB check buyer",
        contactName: "Test Buyer",
        email: `buyer${TEST_EMAIL}`,
        deliveryCountry: "Germany",
        specification: "Coil nails 2.5 × 50 mm",
        quantity: "23 t",
        details: { finish: "bright", collation: "wire" },
        statusTokenHash: hash,
      },
    });
    await tx.rfqStatusChange.create({ data: { rfqId: created.id, toStatus: "received" } });
    return created;
  });

  await check("request gets a reference in the KZ-YYYY-NNNN format", async () => {
    assert.equal(rfq.reference, "KZ-2099-0001");
    assert.equal(rfq.status, "received");
  });

  await check("status link: only its hash is stored, and the hash finds the request", async () => {
    assert.match(rfq.statusTokenHash, /^[0-9a-f]{64}$/);
    assert.notEqual(rfq.statusTokenHash, token);
    const [{ count }] = await db.$queryRaw<{ count: bigint }[]>`
      SELECT count(*) FROM rfqs WHERE position(${token} in rfqs::text) > 0`;
    assert.equal(count, BigInt(0), "the secret itself is in the database");
    const found = await db.rfq.findUnique({ where: { statusTokenHash: hashStatusToken(token) } });
    assert.equal(found?.id, rfq.id);
    const wrong = await db.rfq.findUnique({ where: { statusTokenHash: hashStatusToken(`${token}x`) } });
    assert.equal(wrong, null);
  });

  await check("status change is recorded with who made it", async () => {
    await db.$transaction([
      db.rfq.update({ where: { id: rfq.id }, data: { status: "in_review", companyId: company.id } }),
      db.rfqStatusChange.create({
        data: { rfqId: rfq.id, fromStatus: "received", toStatus: "in_review", changedById: staff.id },
      }),
    ]);
    const history = await db.rfqStatusChange.findMany({ where: { rfqId: rfq.id }, orderBy: { createdAt: "asc" } });
    assert.deepEqual(history.map((h) => [h.fromStatus, h.toStatus]), [[null, "received"], ["received", "in_review"]]);
    assert.equal(history[1].changedById, staff.id);
  });

  const clientMessageId = randomUUID();
  await check("chat: a message sent twice (reconnect) is saved once", async () => {
    await db.chatMessage.create({ data: { rfqId: rfq.id, sender: "buyer", body: "Hello", clientMessageId } });
    const again = db.chatMessage.create({ data: { rfqId: rfq.id, sender: "buyer", body: "Hello", clientMessageId } });
    assert.equal(await errorCode(again), "P2002");
    await db.chatMessage.create({ data: { rfqId: rfq.id, sender: "staff", staffUserId: staff.id, body: "Hi!" } });
    assert.equal(await db.chatMessage.count({ where: { rfqId: rfq.id } }), 2);
  });

  await check("file record: storage name must be unique", async () => {
    const file = { rfqId: rfq.id, fileName: "drawing.pdf", mimeType: "application/pdf", sizeBytes: 1234 };
    await db.rfqFile.create({ data: { ...file, storagePath: "db-check/a.pdf" } });
    assert.equal(await errorCode(db.rfqFile.create({ data: { ...file, storagePath: "db-check/a.pdf" } })), "P2002");
  });

  await check("CBAM estimate keeps exact decimal values", async () => {
    const estimate = await db.cbamEstimate.create({
      data: {
        email: `cbam${TEST_EMAIL}`, productType: "BF-BOF (blast furnace)", tonnes: "1250.5",
        emissionFactor: "2.1", phaseInRate: "0.025", carbonPrice: "80.00", estimatedCost: "5252.10",
      },
    });
    assert.equal(estimate.tonnes.toString(), "1250.5");
    assert.equal(estimate.estimatedCost.toFixed(2), "5252.10");
  });

  await check("a client company can't be deleted while requests are linked to it", async () => {
    assert.equal(await errorCode(db.company.delete({ where: { id: company.id } })), "P2003");
  });

  await check("deleting a staff user keeps their messages and history", async () => {
    await db.staffUser.delete({ where: { id: staff.id } });
    assert.equal(await db.chatMessage.count({ where: { rfqId: rfq.id } }), 2);
    assert.equal(await db.chatMessage.count({ where: { rfqId: rfq.id, sender: "staff", staffUserId: null } }), 1);
    assert.equal(await db.rfqStatusChange.count({ where: { rfqId: rfq.id, changedById: null } }), 2);
  });

  await check("deleting a request also deletes its files, history and chat", async () => {
    await db.rfq.delete({ where: { id: rfq.id } });
    const left = await Promise.all([
      db.rfqFile.count({ where: { rfqId: rfq.id } }),
      db.rfqStatusChange.count({ where: { rfqId: rfq.id } }),
      db.chatMessage.count({ where: { rfqId: rfq.id } }),
    ]);
    assert.deepEqual(left, [0, 0, 0]);
  });

  await check("25 requests at the same moment get 25 different, consecutive references", async () => {
    const refs = await Promise.all(
      Array.from({ length: 25 }, () => db.$transaction((tx) => nextRfqReference(tx, 2098))),
    );
    const expected = Array.from({ length: 25 }, (_, i) => `KZ-2098-${String(i + 1).padStart(4, "0")}`);
    assert.deepEqual([...refs].sort(), expected);
  });

  await check("a failed request doesn't use up a reference number", async () => {
    const before = await db.rfqCounter.findUnique({ where: { year: 2098 } });
    await db
      .$transaction(async (tx) => {
        await nextRfqReference(tx, 2098);
        throw new Error("request failed");
      })
      .catch(() => {});
    const after = await db.rfqCounter.findUnique({ where: { year: 2098 } });
    assert.equal(after?.lastNumber, before?.lastNumber);
  });
}

try {
  await main();
} catch (error) {
  failed = true;
  console.error(error);
} finally {
  await cleanUp();
  await db.$disconnect();
}
console.log(failed ? "\nDatabase check FAILED." : "\nAll database checks passed; test data removed.");
process.exitCode = failed ? 1 : 0;
