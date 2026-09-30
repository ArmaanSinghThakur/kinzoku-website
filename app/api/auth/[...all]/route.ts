import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// Better Auth's endpoints for staff login and logout (/api/auth/…). Sign-up is switched off.
export const { GET, POST } = toNextJsHandler(auth);
