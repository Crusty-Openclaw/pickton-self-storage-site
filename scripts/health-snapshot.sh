#!/usr/bin/env bash
set -euo pipefail

OUT="/home/crusty/.openclaw/workspace/memory/pi-health.log"
TS=$(date -Is)

{
  echo "=== ${TS} ==="
  echo "-- uptime --"; uptime
  echo "-- disk --"; df -h / /home || true
  echo "-- mem --"; free -h || true
  echo "-- openclaw --"; systemctl --user is-active openclaw-gateway || true
  systemctl --user status openclaw-gateway --no-pager -l | sed -n '1,20p' || true
  echo
} >> "$OUT"
