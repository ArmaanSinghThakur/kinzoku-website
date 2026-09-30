#!/bin/sh
# Nightly backup (plan: "a full backup is taken every night and kept for 14 days"). Runs in the
# "backup" container: the database as a compressed pg_dump, the uploaded files as a tar archive,
# and checksums for both. A backup only appears under its final name once it is complete.
#   npm run backup:now    take one now
set -eu

stamp=$(date +%Y-%m-%d_%H%M%S)
tmp="/backups/.incomplete-$stamp"
trap 'rm -rf "$tmp"' EXIT
mkdir -p "$tmp"

pg_dump --format=custom --compress=9 --file="$tmp/database.dump"
tar -czf "$tmp/uploads.tar.gz" -C /uploads .
(cd "$tmp" && sha256sum database.dump uploads.tar.gz > SHA256SUMS)
mv "$tmp" "/backups/$stamp"
date -Iseconds > /backups/LAST_SUCCESS

# Keep 14 days (and never delete the newest backup).
find /backups -mindepth 1 -maxdepth 1 -type d -name '20*' -mtime +"${KEEP_DAYS:-14}" ! -name "$stamp" -exec rm -rf {} +

echo "Backup $stamp done: $(du -sh "/backups/$stamp" | cut -f1); $(ls -d /backups/20* | wc -l) kept."
