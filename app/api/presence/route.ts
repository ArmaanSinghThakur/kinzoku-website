import { staffOnline } from "@/lib/live/emit";

// "Sales team online" on the Contact page (plan): answers only whether someone from the sales
// team has the admin area open. A plain request, so public pages need no live connection.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ online: staffOnline() }, { headers: { "Cache-Control": "no-store" } });
}
