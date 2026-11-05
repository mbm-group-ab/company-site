#!/usr/bin/env bash
# Copy company-site to parvaz-ist for the Iranian domains (mbm-family.ir via ArvanCloud,
# mbm-computer.ir via Cloudflare). nginx on ist serves /var/www/mbm-family on port 80 for both;
# script.js shows them in Farsi only (no language switcher) because the host ends in .ir.
#   bash company-site/deploy/static-sites/sync-ir.sh        (needs the ssh alias parvaz-ist)
set -euo pipefail
repo="$(cd "$(dirname "$0")/../.." && pwd)"
SKIP='(^|/)\.|(^|/)(firebase\.json|CLAUDE\.md|LICENSE|update-site\.ps1|Dockerfile|docker-compose\.yml)$|\.(md|ps1|py|spec)$|^deploy/'
list="${TMPDIR:-/tmp}/company-site-ir.files"
git -C "$repo" ls-files | grep -Ev "$SKIP" > "$list"
ssh parvaz-ist "rm -rf /var/www/mbm-family.new && mkdir -p /var/www/mbm-family.new"
tar -C "$repo" -cf - -T "$list" | ssh parvaz-ist "tar -C /var/www/mbm-family.new -xf -"
ssh parvaz-ist "cd /var/www && rm -rf mbm-family.old && { [ -d mbm-family ] && mv mbm-family mbm-family.old || true; } && mv mbm-family.new mbm-family && rm -rf mbm-family.old && chmod -R a+rX mbm-family"
echo "synced $(wc -l < "$list") files to parvaz-ist:/var/www/mbm-family"
