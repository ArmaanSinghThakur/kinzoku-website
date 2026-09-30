import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { requireStaff } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { uploadPath } from "@/lib/uploads";

// Staff-only download of a file attached to a request. Always as a download, never shown in the
// browser, and never cached.
export const dynamic = "force-dynamic";

const notFound = () => new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });

/** attachment; filename="plain fallback"; filename*=UTF-8''exact name */
function contentDisposition(name: string) {
  const fallback = name.replace(/[^\x20-\x7e]|["\\]/g, "_");
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(name)}`;
}

export async function GET(_request: Request, { params }: RouteContext<"/admin/files/[id]">) {
  await requireStaff();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return notFound();
  const file = await db.rfqFile.findUnique({ where: { id } });
  if (!file) return notFound();
  const path = uploadPath(file.storagePath);
  const size = await stat(path).then((s) => s.size).catch(() => null);
  if (size === null) return notFound();
  return new Response(Readable.toWeb(createReadStream(path)) as ReadableStream, {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(size),
      "Content-Disposition": contentDisposition(file.fileName),
      "Cache-Control": "private, no-store",
    },
  });
}
