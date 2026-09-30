import { Cron } from "croner";
import { runRetention } from "@/lib/retention";

// Scheduled jobs inside the website's program (started by instrumentation.ts). The nightly
// backup runs separately, in the "backup" container (docker-compose.yml).

export function startNightlyJobs() {
  const state = globalThis as unknown as { kzNightly?: Cron };
  if (state.kzNightly) return;
  state.kzNightly = new Cron("0 3 * * *", { timezone: "Europe/Amsterdam", protect: true, name: "clean-up" }, async () => {
    try {
      const summary = await runRetention();
      console.log("Nightly clean-up:", JSON.stringify(summary));
    } catch (error) {
      console.error("Nightly clean-up failed:", error);
    }
  });
  console.log(`Nightly clean-up scheduled; next run ${state.kzNightly.nextRun()?.toISOString()}`);
}
