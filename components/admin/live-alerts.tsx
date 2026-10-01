"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { admin } from "@/content/admin";
import { cn } from "@/lib/cn";
import { liveSocket } from "@/lib/live/client";
import type { NewRequestEvent } from "@/lib/live/protocol";

type Alert = { id: number; text: string; reference: string };
const t = admin.live;

/** A short two-tone sound, made in the browser (no sound file). Silent if the browser blocks it. */
function chime() {
  try {
    const audio = new AudioContext();
    [880, 1175].forEach((frequency, i) => {
      const tone = audio.createOscillator();
      const volume = audio.createGain();
      const start = audio.currentTime + i * 0.18;
      tone.frequency.value = frequency;
      volume.gain.setValueAtTime(0.07, start);
      volume.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
      tone.connect(volume).connect(audio.destination);
      tone.start(start);
      tone.stop(start + 0.3);
    });
    setTimeout(() => void audio.close(), 1000);
  } catch {}
}

/**
 * The admin area's live connection (plan: "new request alert"): new requests and buyer messages
 * appear at once with a sound, and the page shows the latest data without reloading.
 */
export function LiveAlerts() {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const socket = liveSocket();
    const add = (text: string, reference: string) => {
      const id = Date.now() + Math.random();
      setAlerts((list) => [...list.slice(-3), { id, text, reference }]);
      setTimeout(() => setAlerts((list) => list.filter((a) => a.id !== id)), 20_000);
      chime();
      router.refresh();
    };
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onRequest = (e: NewRequestEvent) => add(t.newRequest(e.reference, e.companyName, e.type), e.reference);
    const onMessage = (e: { reference: string }) => add(t.newMessage(e.reference), e.reference);
    const onStatus = () => router.refresh();
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("rfq:new", onRequest);
    socket.on("chat:new", onMessage);
    socket.on("rfq:status", onStatus);
    if (socket.connected) onConnect();
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("rfq:new", onRequest);
      socket.off("chat:new", onMessage);
      socket.off("rfq:status", onStatus);
    };
  }, [router]);

  return (
    <>
      <span className={cn("flex items-center gap-1.5 text-xs", connected ? "text-emerald-300" : "text-white/50")}>
        <span aria-hidden className={cn("size-2 rounded-full", connected ? "bg-emerald-400" : "bg-white/30")} />
        {connected ? t.on : t.off}
      </span>
      <div role="status" aria-live="polite" className="fixed top-4 right-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
        {alerts.map((a) => (
          <div key={a.id} className="rounded-lg border border-line bg-white p-4 text-sm text-graphite shadow-card">
            <p className="font-semibold text-graphite">{a.text}</p>
            <div className="mt-2 flex gap-4">
              <Link href={`/admin/requests/${a.reference}`} onClick={() => setAlerts((l) => l.filter((x) => x.id !== a.id))}>
                {t.open}
              </Link>
              <button type="button" className="text-muted hover:text-graphite" onClick={() => setAlerts((l) => l.filter((x) => x.id !== a.id))}>
                {t.dismiss}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
