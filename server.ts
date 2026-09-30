// The website and its live connection (Socket.IO) in one program on one port (plan: "server.ts
// starts the website and the live channel together").
//   npm run dev      development:  tsx server.ts --dev
//   npm start        production, after `npm run build`:  node dist/server.mjs
import { createServer } from "node:http";
import * as nextEnvModule from "@next/env";

// @next/env is CommonJS: its functions are named exports when this file runs through tsx
// (development) and sit on the default export when Node loads the production bundle.
const nextEnv = "loadEnvConfig" in nextEnvModule ? nextEnvModule : (nextEnvModule as unknown as { default: typeof nextEnvModule }).default;

async function main() {
  const dev = process.argv.includes("--dev");
  // Before Next.js and React load: they choose their production or development code from this.
  if (!dev) Object.assign(process.env, { NODE_ENV: "production" });
  nextEnv.loadEnvConfig(process.cwd(), dev);

  const port = Number(process.env.PORT) || 3000;
  const { default: next } = await import("next");
  const { attachLive } = await import("./lib/live/server");

  const httpServer = createServer();
  const app = next({ dev, httpServer, port });
  const handle = app.getRequestHandler();
  await app.prepare();
  httpServer.on("request", (req, res) => void handle(req, res));
  attachLive(httpServer);
  httpServer.listen(port, () => {
    console.log(`> Kinzoku website with live connection on http://localhost:${port} (${dev ? "development" : "production"})`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
