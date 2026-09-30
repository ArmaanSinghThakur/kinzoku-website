#!/bin/sh
# Restore test (plan: "a restore is tested once before launch"): checks the newest backup's
# checksums, restores its database into a separate scratch database and its files into a scratch
# folder, and compares both with the live ones. The live database and files are not touched.
#   npm run backup:restore-test
set -eu

latest=$(ls -1d /backups/20* 2>/dev/null | tail -1)
[ -n "$latest" ] || { echo "No backup found."; exit 1; }
echo "Testing $latest"
(cd "$latest" && sha256sum -c -s SHA256SUMS) && echo "  checksums OK"

scratch=kinzoku_restore_test
dropdb --if-exists "$scratch"
createdb "$scratch"
trap 'dropdb --if-exists "$scratch"; rm -rf /tmp/restored-uploads' EXIT
pg_restore --no-owner --exit-on-error --dbname="$scratch" "$latest/database.dump"

status=0
for table in rfqs rfq_files rfq_status_history chat_messages email_outbox companies staff_users staff_accounts cbam_estimates rfq_reference_counters _prisma_migrations; do
  live=$(psql -tAc "SELECT count(*) FROM $table")
  restored=$(psql -d "$scratch" -tAc "SELECT count(*) FROM $table")
  if [ "$live" = "$restored" ]; then echo "  $table: $restored rows"; else echo "  $table: DIFFERENT (live $live, restored $restored)"; status=1; fi
done

mkdir -p /tmp/restored-uploads
tar -xzf "$latest/uploads.tar.gz" -C /tmp/restored-uploads
live_files=$(cd /uploads && find . -type f | sort | xargs -r sha256sum | sha256sum)
restored_files=$(cd /tmp/restored-uploads && find . -type f | sort | xargs -r sha256sum | sha256sum)
count=$(find /tmp/restored-uploads -type f | wc -l)
if [ "$live_files" = "$restored_files" ]; then echo "  uploads: $count files, identical"; else echo "  uploads: DIFFERENT"; status=1; fi

[ "$status" = 0 ] && echo "Restore test passed." || echo "Restore test FAILED (a change since the backup also shows as a difference)."
exit "$status"
