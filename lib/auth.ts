import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import { mailSettings } from "@/lib/mailer";

// Staff login for the admin area (Step 17), with Better Auth: email and password only, no public
// sign-up (accounts are made by an admin), sessions kept in the database so deleting one logs that
// person out at once. Nothing is sent to any outside service.
export const auth = betterAuth({
  appName: "Kinzoku admin",
  baseURL: mailSettings.siteUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(db, { provider: "postgresql" }),
  telemetry: { enabled: false },
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
  },
  user: {
    modelName: "staffUser",
    additionalFields: {
      role: { type: "string", input: false },
      active: { type: "boolean", input: false },
      mustChangePassword: { type: "boolean", input: false },
    },
  },
  session: {
    modelName: "staffSession",
    expiresIn: 12 * 60 * 60, // logged out after 12 hours without using the admin area
    updateAge: 60 * 60,
  },
  account: { modelName: "staffAccount" },
  verification: { modelName: "authVerification" },
  rateLimit: {
    enabled: true, // also locally, so it can be tested
    window: 60,
    max: 60,
    // Guessing passwords: 5 tries per 15 minutes per address.
    customRules: { "/sign-in/email": { window: 15 * 60, max: 5 } },
  },
  advanced: {
    cookiePrefix: "kz",
    database: { generateId: "uuid" },
    // Caddy (Phase 5) replaces this header with the visitor's real address.
    ipAddress: { ipAddressHeaders: ["x-forwarded-for"] },
  },
  databaseHooks: {
    session: {
      create: {
        // Switched-off accounts can't log in, even with the right password.
        before: async (session) => {
          const user = await db.staffUser.findUnique({ where: { id: session.userId }, select: { active: true } });
          return user?.active ? { data: session } : false;
        },
        after: async (session) => {
          await db.staffUser.update({ where: { id: session.userId }, data: { lastLoginAt: new Date() } });
        },
      },
    },
  },
  plugins: [nextCookies()], // lets Server Actions set and clear the login cookie
});
