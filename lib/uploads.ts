import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileTypeFromBuffer } from "file-type";

// Files attached to quote requests. They are kept outside public/ (never served directly) under
// random names; only the buyer's original file name is kept, in the database, for display.
// UPLOAD_DIR is a Docker volume on the server (Phase 5); locally storage/uploads (not in git).
// turbopackIgnore: runtime data, not code, so the build must not bundle what is in it.
export const uploadDir = path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR ?? "storage/uploads");

/** Types recognised by their contents (not by name). Macro-enabled Office files are not accepted. */
const accepted: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  tif: "image/tiff",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  odt: "application/vnd.oasis.opendocument.text",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
};
/** Older Word, Excel and PowerPoint files all look the same inside ("cfb"), so their name decides. */
const legacyOffice: Record<string, string> = {
  doc: "application/msword",
  xls: "application/vnd.ms-excel",
  ppt: "application/vnd.ms-powerpoint",
};

export type Upload = { file: File; bytes: Uint8Array; ext: string; mimeType: string };

/** Reads a file and checks what it really is. Returns null for anything not accepted. */
export async function inspectUpload(file: File): Promise<Upload | null> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = await fileTypeFromBuffer(bytes);
  if (!type) return null;
  if (type.ext === "cfb") {
    const named = path.extname(file.name).slice(1).toLowerCase();
    return legacyOffice[named] ? { file, bytes, ext: named, mimeType: legacyOffice[named] } : null;
  }
  return accepted[type.ext] ? { file, bytes, ext: type.ext, mimeType: accepted[type.ext] } : null;
}

/** The buyer's file name made safe to show: no folders, control characters or overlong names. */
function displayName(name: string) {
  const clean = name.normalize("NFC").replace(/[\u0000-\u001f\u007f/\\]/g, "").trim() || "file";
  if (clean.length <= 255) return clean;
  const ext = path.extname(clean).slice(0, 16);
  return clean.slice(0, 255 - ext.length) + ext;
}

/** Saves checked files as uploads/<year>/<month>/<random>.<ext>, returning their database rows. */
export async function saveUploads(uploads: Upload[]) {
  const now = new Date();
  const folder = path.posix.join(String(now.getUTCFullYear()), String(now.getUTCMonth() + 1).padStart(2, "0"));
  await mkdir(path.join(/*turbopackIgnore: true*/ uploadDir, folder), { recursive: true });
  const saved: { fileName: string; storagePath: string; mimeType: string; sizeBytes: number }[] = [];
  try {
    for (const upload of uploads) {
      const storagePath = path.posix.join(folder, `${randomUUID()}.${upload.ext}`);
      // "wx": never overwrite an existing file.
      await writeFile(uploadPath(storagePath), upload.bytes, { flag: "wx" });
      saved.push({ fileName: displayName(upload.file.name), storagePath, mimeType: upload.mimeType, sizeBytes: upload.bytes.byteLength });
    }
  } catch (error) {
    await deleteUploads(saved.map((s) => s.storagePath));
    throw error;
  }
  return saved;
}

/** Full path of a stored file; refuses any path that would lead outside the upload folder. */
export function uploadPath(storagePath: string) {
  const full = path.resolve(uploadDir, storagePath);
  if (!full.startsWith(uploadDir + path.sep)) throw new Error(`Invalid upload path: ${storagePath}`);
  return full;
}

/** Removes stored files; files that are already gone are ignored. */
export async function deleteUploads(storagePaths: string[]) {
  await Promise.all(
    storagePaths.map((p) =>
      unlink(uploadPath(p)).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== "ENOENT") throw error;
      }),
    ),
  );
}
