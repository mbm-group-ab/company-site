#!/usr/bin/env bash
# Copy the three static sites to the VPS (needs ssh access as deploy).
#   bash company-site/deploy/static-sites/sync.sh [site...]   sites: company-site disk-recovery-tool duplicompare
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"            # the Projects folder
KEY="${VPS_KEY:-$ROOT/plans/keys/job_finder_deploy}"
SSH=(ssh -i "$KEY" -o IdentitiesOnly=yes deploy@216.9.226.9)
declare -A DIR=([company-site]=company-site [disk-recovery-tool]=disk-recovery-tool [duplicompare]=drive-compare-tool)
# Not published: dot files/folders, docs, build scripts, sources, Firebase config.
SKIP='(^|/)\.|(^|/)(firebase\.json|CLAUDE\.md|LICENSE|CMakeLists\.txt|update-site\.ps1|Dockerfile|docker-compose\.yml)$|\.(md|ps1|py|spec)$|^deploy/'
SITES=("$@"); [ ${#SITES[@]} -gt 0 ] || SITES=(company-site disk-recovery-tool duplicompare)
for s in "${SITES[@]}"; do
  repo="$ROOT/${DIR[$s]}"
  echo "== $s"
  git -C "$repo" ls-files | grep -Ev "$SKIP" > "${TMPDIR:-/tmp}/$s.files"
  "${SSH[@]}" "rm -rf ~/static-sites/sites/$s.new && mkdir -p ~/static-sites/sites/$s.new"
  tar -C "$repo" -cf - -T "${TMPDIR:-/tmp}/$s.files" | "${SSH[@]}" "tar -C ~/static-sites/sites/$s.new -xf -"
  "${SSH[@]}" "cd ~/static-sites/sites && rm -rf $s.old && { [ -d $s ] && mv $s $s.old || true; } && mv $s.new $s && rm -rf $s.old && chmod -R a+rX $s"
done
