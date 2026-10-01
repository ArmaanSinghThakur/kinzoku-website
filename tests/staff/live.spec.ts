import { randomUUID } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";
import type pg from "pg";
import { io, type Socket } from "socket.io-client";
import { baseURL, clearMail, connectDb, cookieForBrowser, loggedInStaff, postQuote, removeTestData, statusToken } from "../helpers";

// The live connection (Step 18): who may connect, new-request alerts, chat that never loses or
// doubles a message, live status, "Sales team online", and logging people out.

test.describe.configure({ mode: "serial" });
let db: pg.Client;
let adminCookie = "";
let salesCookie = "";
let staff: Socket;
let reference = "";
let rfqId = "";
let token = "";

const connect = (options: Parameters<typeof io>[1] = {}) =>
  new Promise<{ socket: Socket; error: string | null }>((resolve) => {
    const socket = io(baseURL, { path: "/api/live", transports: ["websocket"], reconnection: false, forceNew: true, ...options });
    socket.once("connect", () => resolve({ socket, error: null }));
    socket.once("connect_error", (e) => resolve({ socket, error: e.message }));
  });
const once = <T>(socket: Socket, event: string, ms = 4000) =>
  new Promise<T | null>((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    socket.once(event, (data: T) => {
      clearTimeout(timer);
      resolve(data ?? (true as T));
    });
  });
type Reply = { ok: boolean; error?: string; message?: { id: string; body: string; staffName: string | null }; messages?: { body: string; staffName: string | null }[] };
const ask = (socket: Socket, event: string, payload: unknown) =>
  socket.timeout(5000).emitWithAck(event, payload).catch((e: Error) => ({ ok: false, error: `timeout: ${e.message}` })) as Promise<Reply>;
const presence = async () => ((await (await fetch(`${baseURL}/api/presence`)).json()) as { online: boolean }).online;
const asStaff = (cookie: string) => ({ extraHeaders: { cookie, Origin: baseURL } });
const asBuyer = () => ({ auth: { token }, extraHeaders: { Origin: baseURL } });

test.beforeAll(async () => {
  db = await connectDb();
  await clearMail();
  adminCookie = await loggedInStaff(db, "Lea Live", "lea@live.invalid", "admin", 60);
  salesCookie = await loggedInStaff(db, "Sid Sales", "sid@live.invalid", "sales", 61);
});
test.afterAll(async () => {
  staff?.disconnect();
  await removeTestData(db);
  await db.end();
  await clearMail();
});

test("who may connect: not without login or link, not from other sites", async () => {
  expect((await connect()).error).toBe("unauthorized");
  expect((await connect({ auth: { token: "A".repeat(43) } })).error).toBe("unauthorized");
  expect((await connect({ extraHeaders: { Origin: "https://evil.example", cookie: adminCookie } })).error).not.toBeNull();
  expect(await presence()).toBe(false);
  staff = (await connect(asStaff(adminCookie))).socket;
  expect(staff.connected).toBe(true);
  expect(await presence()).toBe(true);
});

test("a new request reaches staff at once", async () => {
  const alert = once<{ reference: string; companyName: string }>(staff, "rfq:new");
  const response = await postQuote({ type: "wire", companyName: "Live Wire BV", contactName: "Bo Buyer", email: "bo@live.invalid", phone: "+31 6 1111 2222", specification: "SAE 1008, 5.5 mm", deliveryCountry: "Antwerp, BE" }, [], 62);
  reference = (await response.json()).reference;
  expect(await alert).toMatchObject({ reference, companyName: "Live Wire BV" });
  rfqId = (await db.query("SELECT id FROM rfqs WHERE reference = $1", [reference])).rows[0].id;
  token = await statusToken("bo@live.invalid");
});

test("chat: saved, delivered at once, never twice; typing and read marks", async () => {
  const buyer = (await connect(asBuyer())).socket;
  const joined = await ask(buyer, "chat:join", { reference: "KZ-0000-0000" }); // a reference from the buyer is ignored
  expect(joined).toMatchObject({ ok: true, messages: [] });
  expect((await ask(staff, "chat:join", { reference })).ok).toBe(true);

  const clientMessageId = randomUUID();
  const staffGets = once<{ id: string }>(staff, "chat:message");
  const staffAlerted = once<{ reference: string }>(staff, "chat:new");
  const sent = await ask(buyer, "chat:send", { body: "Hello, can you do 40 t?", clientMessageId });
  expect(sent.ok).toBe(true);
  expect((await staffGets)?.id).toBe(sent.message!.id);
  expect((await staffAlerted)?.reference).toBe(reference);
  const again = await ask(buyer, "chat:send", { body: "Hello, can you do 40 t?", clientMessageId });
  expect(again.message?.id).toBe(sent.message!.id);
  expect(Number((await db.query("SELECT count(*) FROM chat_messages WHERE rfq_id = $1", [rfqId])).rows[0].count)).toBe(1);

  const typing = once<{ sender: string }>(buyer, "chat:typing");
  staff.emit("chat:typing", { reference });
  expect((await typing)?.sender).toBe("staff");
  const read = once<{ reader: string }>(buyer, "chat:read");
  staff.emit("chat:read", { reference });
  expect((await read)?.reader).toBe("staff");
  expect((await db.query("SELECT read_at FROM chat_messages WHERE rfq_id = $1", [rfqId])).rows[0].read_at).not.toBeNull();

  for (const payload of [{ body: "  ", clientMessageId: randomUUID() }, { body: "x".repeat(2001), clientMessageId: randomUUID() }, { body: "hi", clientMessageId: "123" }]) {
    expect(await ask(buyer, "chat:send", payload)).toMatchObject({ ok: false, error: "invalid" });
  }
  buyer.disconnect();
});

test("staff can't write about a request they haven't opened", async () => {
  const other = (await (await postQuote({ type: "other", companyName: "Other BV", contactName: "O", email: "o@live.invalid", message: "hi" }, [], 63)).json()).reference;
  expect(await ask(staff, "chat:send", { reference: other, body: "not opened", clientMessageId: randomUUID() })).toMatchObject({ ok: false, error: "invalid" });
});

test("after reconnecting, missed messages are loaded", async () => {
  await ask(staff, "chat:send", { reference, body: "Yes, 40 t is fine.", clientMessageId: randomUUID() });
  const buyer = (await connect(asBuyer())).socket;
  const joined = await ask(buyer, "chat:join", {});
  expect(joined.messages?.map((m) => m.body)).toEqual(["Hello, can you do 40 t?", "Yes, 40 t is fine."]);
  expect(joined.messages?.[1].staffName).toBe("Lea Live");
  buyer.disconnect();
});

test.describe("in the browser", () => {
  let adminPage: Page;
  let buyerPage: Page;

  test("buyer and staff chat live; status changes show without reloading", async ({ browser }) => {
    const adminContext = await browser.newContext();
    await adminContext.addCookies([cookieForBrowser(adminCookie)]);
    const buyerContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await buyerContext.addCookies([{ name: "kz_consent", value: "1.0", url: baseURL }]);
    adminPage = await adminContext.newPage();
    buyerPage = await buyerContext.newPage();
    const sockets: string[] = [];
    buyerPage.on("websocket", (ws) => sockets.push(ws.url()));

    await adminPage.goto(`/admin/requests/${reference}`);
    await expect(adminPage.getByText("Live", { exact: true })).toBeVisible();
    await buyerPage.goto(`/rfq/status/${token}`);
    await expect(buyerPage.getByText("Connected")).toBeVisible();
    expect(sockets.some((u) => u.includes("/api/live/") && u.includes("transport=websocket"))).toBe(true);
    await expect(buyerPage.locator("[role=log]")).toContainText("Yes, 40 t is fine.");

    await adminPage.fill("#chat-message", "We can also offer 5.5 mm SAE 1006");
    await expect(buyerPage.getByText("Kinzoku is typing…")).toBeVisible();
    await adminPage.press("#chat-message", "Enter");
    await expect(buyerPage.getByText("We can also offer 5.5 mm SAE 1006")).toBeVisible();
    await expect(adminPage.locator("[role=log]").getByText("Read")).toBeVisible();

    await buyerPage.fill("#chat-message", "Great, please send the quote.");
    await buyerPage.click("form:has(#chat-message) button[type=submit]");
    await expect(adminPage.getByText("Great, please send the quote.")).toBeVisible();
    await expect(adminPage.getByText(`New message about ${reference}`)).toBeVisible();

    await adminPage.click("form:has(input[name=to][value=quote_sent]) button");
    await expect(buyerPage.locator("li[aria-current=step]")).toContainText("Quote sent");
  });

  test("offline: a message waits, then goes out exactly once", async () => {
    await buyerPage.context().setOffline(true);
    await buyerPage.fill("#chat-message", "Sent while offline");
    await buyerPage.click("form:has(#chat-message) button[type=submit]");
    await expect(buyerPage.getByText("Not sent yet")).toBeVisible({ timeout: 15_000 });
    await buyerPage.context().setOffline(false);
    await expect(adminPage.getByText("Sent while offline")).toBeVisible({ timeout: 30_000 });
    await buyerPage.waitForTimeout(1500);
    expect(Number((await db.query("SELECT count(*) FROM chat_messages WHERE rfq_id = $1 AND body = 'Sent while offline'", [rfqId])).rows[0].count)).toBe(1);
  });

  test("'Sales team online' on the contact page; new requests pop up in the admin", async () => {
    const contact = await buyerPage.context().newPage();
    await contact.goto("/contact-us");
    await expect(contact.getByText("Sales team online now")).toBeVisible();
    const response = await postQuote({ type: "nails", companyName: "Alert Test AG", contactName: "A", email: "a@live.invalid", phone: "+41 44 123 4567", specification: "2.5 × 50", deliveryCountry: "Zürich, CH" }, [], 64);
    const { reference: third } = await response.json();
    await expect(adminPage.getByText(`New request ${third} from Alert Test AG`)).toBeVisible();
  });

  test("'Log out everywhere' closes that person's live connection at once", async () => {
    const sales = (await connect(asStaff(salesCookie))).socket;
    const cut = once<string>(sales, "disconnect", 8000);
    await adminPage.goto("/admin/staff");
    await adminPage.locator("tr", { hasText: "sid@live.invalid" }).locator("button[value=end]").click();
    expect(await cut).toBe("io server disconnect");
    expect((await connect(asStaff(salesCookie))).error).toBe("unauthorized");
  });

  test("everyone gone: the online badge disappears", async () => {
    staff.disconnect();
    await adminPage.context().close();
    await buyerPage.context().close();
    await expect.poll(presence).toBe(false);
  });
});

test("more than 20 messages a minute from one buyer are refused", async () => {
  const buyer = (await connect(asBuyer())).socket;
  await ask(buyer, "chat:join", {});
  const results: string[] = [];
  for (let i = 0; i < 25; i++) results.push((await ask(buyer, "chat:send", { body: `m${i}`, clientMessageId: randomUUID() })).error ?? "ok");
  expect(results.filter((r) => r === "ok").length).toBeLessThanOrEqual(20);
  expect(results.at(-1)).toBe("rate_limited");
  buyer.disconnect();
});
