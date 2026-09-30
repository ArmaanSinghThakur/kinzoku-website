import path from "node:path";
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Applied to every response. The Content-Security-Policy is added in the cookie/analytics
// step, once the exact Google Analytics origins are wired in.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  // HSTS only in production: browsers ignore it on plain http://localhost anyway.
  ...(isProd
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]
    : []),
];

// Pin the project root so Next.js ignores the lockfile and node_modules in E:\kAIzen.
const projectRoot = path.join(__dirname);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,

  async redirects() {
    return [
      // Old quote link used by the 8 language pages (currently a 404).
      { source: "/contactus-sales", destination: "/contact-us#quote", permanent: true },
    ];
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
