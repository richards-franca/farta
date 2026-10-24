#!/usr/bin/env bash
set -euo pipefail
if [ "$(id -u)" -ne 0 ]; then echo 'Run as root.' >&2; exit 1; fi
. /etc/os-release
if [ "$ID" != ubuntu ]; then echo 'This script targets Ubuntu.' >&2; exit 1; fi
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl gnupg ufw unzip
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
printf '%s\n' "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $VERSION_CODENAME stable" > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker
if ! id farta >/dev/null 2>&1; then useradd -m -s /bin/bash farta; fi
usermod -aG docker farta
install -d -m 0750 -o root -g farta /opt/farta /opt/farta/bin
install -d -m 0750 -o farta -g farta /opt/farta/releases
install -d -m 0700 -o farta -g farta /home/farta/.ssh
if ! swapon --show --noheadings | grep -q .; then
  if [ ! -e /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
  fi
  swapon /swapfile
  grep -q '^/swapfile ' /etc/fstab || printf '%s\n' '/swapfile none swap sw 0 0' >> /etc/fstab
fi
printf '%s\n' 'vm.swappiness=10' > /etc/sysctl.d/90-farta.conf
sysctl -p /etc/sysctl.d/90-farta.conf
# Preserve the SSH port reported by the running daemon before enabling UFW.
sshd -T | awk '$1=="port" { print $2 }' | while read -r port; do ufw allow "$port/tcp"; done
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
docker version --format '{{.Server.Version}}'
docker compose version
