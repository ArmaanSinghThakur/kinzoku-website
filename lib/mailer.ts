import nodemailer, { type SendMailOptions, type Transporter } from "nodemailer";
import { site } from "@/lib/site";

// Sends email from info@kinzokutrade.com through Kinzoku's own mailbox (plan: "no new email
// company needed"). Locally SMTP_HOST points at Mailpit, which catches everything.

export const mailSettings = {
  from: { name: site.name, address: process.env.SMTP_USER || site.email },
  salesEmail: process.env.SALES_EMAIL || site.email,
  /** Address used in links inside emails. */
  siteUrl: (process.env.SITE_URL || site.url).replace(/\/$/, ""),
};

let transporter: Transporter | undefined;

function getTransporter() {
  const host = process.env.SMTP_HOST;
  if (!host) throw new Error("SMTP_HOST is not set, so emails can't be sent");
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  transporter ??= nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465: encrypted from the start; other ports upgrade with STARTTLS
    requireTLS: Boolean(user), // never send the mailbox password unencrypted
    auth: user ? { user, pass: process.env.SMTP_PASSWORD } : undefined,
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
  });
  return transporter;
}

export async function sendMail(message: Omit<SendMailOptions, "from">) {
  await getTransporter().sendMail({ from: mailSettings.from, ...message });
}
