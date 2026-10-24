#!/usr/bin/env bash
set -euo pipefail
test "$(id -u)" -eq 0
test -s /root/.ssh/authorized_keys
test -s /home/farta/.ssh/authorized_keys
# Run only after independently testing both dedicated keys.
printf '%s\n' 'PasswordAuthentication no' 'KbdInteractiveAuthentication no' 'PermitRootLogin prohibit-password' > /etc/ssh/sshd_config.d/00-farta-keys.conf
sshd -t
systemctl reload ssh
sshd -T | grep -E '^(port|passwordauthentication|permitrootlogin|kbdinteractiveauthentication) '
