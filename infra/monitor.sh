#!/usr/bin/env bash
set -euo pipefail
cd /opt/farta
if [ ! -s releases/current.env ]; then exit 0; fi
warn() { logger -p daemon.warning -t farta-monitor "$1"; printf '%s\n' "$1"; }
available=$(awk '/MemAvailable:/ { print $2 }' /proc/meminfo)
total=$(awk '/MemTotal:/ { print $2 }' /proc/meminfo)
if [ "$((available * 100 / total))" -lt 20 ]; then warn 'Available host memory is below 20 percent.'; fi
used=$(df --output=pcent / | tail -1 | tr -dc '0-9')
if [ "$used" -gt 80 ]; then warn 'Root filesystem usage is above 80 percent.'; fi
if ! curl -fsS --max-time 10 --resolve farta.site:443:127.0.0.1 https://farta.site/api/health >/dev/null; then warn 'Public application health check failed.'; fi
if ! docker compose --env-file app.env --env-file releases/current.env -f compose.yml exec -T api node -e "fetch('http://127.0.0.1:3001/health/ready').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"; then warn 'API dependency check failed; inspect Supabase availability.'; fi
