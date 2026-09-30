import path from "node:path";
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Only our own origin plus Google Analytics (Google's documented GA4 hosts), which is loaded
// after cookie consent. 'unsafe-inline' scripts are needed because pages are pre-built
// (nonces would force every page to render per request); 'unsafe-eval' only in dev for hot reload.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} https://*.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

// Applied to every response.
const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
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
