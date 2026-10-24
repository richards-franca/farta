#!/usr/bin/env bash
set -euo pipefail
read -r action web api revision extra <<< "${SSH_ORIGINAL_COMMAND:-}"
if [ "$action" = registry-login ] && [[ "${web:-}" =~ ^[a-zA-Z0-9_-]+$ ]] && [ -z "${api:-}" ]; then
  exec docker login ghcr.io --username "$web" --password-stdin
fi
if [ "$action" = rollback ] && [ -z "${web:-}" ]; then
  exec /opt/farta/bin/deploy.sh rollback
fi
if [ "$action" != deploy ] || [ -n "${extra:-}" ]; then exit 2; fi
exec /opt/farta/bin/deploy.sh "$web" "$api" "$revision"
