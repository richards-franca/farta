#!/usr/bin/env bash
set -euo pipefail
cd /opt/farta
exec 9>/opt/farta/releases/deploy.lock
flock -n 9 || { echo 'Another deployment is running.' >&2; exit 1; }
compose() { docker compose --env-file /opt/farta/app.env --env-file "$1" -f /opt/farta/compose.yml "${@:2}"; }
if [ "${1:-}" = rollback ]; then
  test -s releases/previous.env
  compose releases/previous.env up -d --wait --wait-timeout 180
  cp releases/current.env releases/rollback-source.env
  cp releases/previous.env releases/current.env
  cp releases/rollback-source.env releases/previous.env
  echo 'Previous release restored.'
  exit 0
fi
web="${1:-}"; api="${2:-}"; revision="${3:-}"
[[ "$web" =~ ^ghcr\.io/richards-franca/farta-web@sha256:[0-9a-f]{64}$ ]] || exit 2
[[ "$api" =~ ^ghcr\.io/richards-franca/farta-api@sha256:[0-9a-f]{64}$ ]] || exit 2
[[ "$revision" =~ ^[0-9a-f]{40}$ ]] || exit 2
release="releases/$revision.env"
printf 'WEB_IMAGE=%s\nAPI_IMAGE=%s\nREVISION=%s\n' "$web" "$api" "$revision" > "$release"
compose "$release" pull
if compose "$release" up -d --wait --wait-timeout 180 &&
   compose "$release" exec -T api node -e "fetch('http://127.0.0.1:3001/health/ready').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" &&
   curl -fsS --retry-all-errors --retry 12 --retry-delay 5 --connect-timeout 5 --max-time 10 --resolve farta.site:443:127.0.0.1 https://farta.site/api/health >/dev/null; then
  if [ -f releases/current.env ]; then cp releases/current.env releases/previous.env; fi
  cp "$release" releases/current.env
  printf 'Deployed %s\n' "$revision"
else
  if [ -f releases/current.env ]; then compose releases/current.env up -d --wait --wait-timeout 180; fi
  echo 'Deployment failed; retained the recorded previous release where available.' >&2
  exit 1
fi
