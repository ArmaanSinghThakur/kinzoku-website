"use client";

// TEMPORARY (styleguide only): throws during render to demonstrate the error boundaries.
import { useState } from "react";
import { buttonStyles } from "@/components/ui/button-styles";

export function CrashButton({ label }: { label: string }) {
  const [crashed, setCrashed] = useState(false);
  if (crashed) throw new Error(`Styleguide demo: ${label}`);
  return (
    <button type="button" onClick={() => setCrashed(true)} className={buttonStyles({ variant: "secondary", size: "sm" })}>
      {label}
    </button>
  );
}
