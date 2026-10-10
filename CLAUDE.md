# company-site

Static MBM company site (EN/FA/SV), no build step. branch `main`. **Hosted on the VPS since 2026-10-10** (the Firebase Hosting sites of project `mbm-group-ab` vanished): container `static-sites` (nginx, 127.0.0.1:5090) serves this site, disk-recovery-tool and duplicompare; host nginx + certbot per domain; DNS A records in Cloudflare point at the VPS. Files in `deploy/static-sites/`; publish with `bash deploy/static-sites/sync.sh [site]`. The Firebase workflows (`deploy-firebase.yml`) no longer reach a live site. Health checks are set in the hub.

## Adding a project to the catalog
1. Create `all-projects/<directory>/` with a `logo.png` (256x256).
2. Add an object to `all-projects/projects.json` (`name`, `directory`, `icon`, `logo`, `category`, `description`, `url`, `repository`, `status`, `server`, `technologies`). Follow the existing entries.
3. Preview locally: `python -m http.server 8000` and open http://localhost:8000.

## Counts are derived automatically
The hero stats ("N Products", "Products live X/Y") and the project cards are rendered by `script.js` from `projects.json` at runtime. Never hardcode counts in `index.html` or the translations. `status: "live"` counts toward the live figure.

## Translations
All UI strings live in the `translations` object in `script.js` (`en`, `fa`, `sv`). Add every new key to all three.

## Deploy
- A push to `main` only runs `await-approval` in `.github/workflows/deploy-vps.yml`; the owner's 🚀 in MBM Control sends `repository_dispatch` `deploy`, which copies the site to the VPS (ssh + tar, `static-sites` container).
- `update-site.ps1` only checks that every catalog directory exists (no Firebase any more; deploy = the workflow, or `deploy/static-sites/sync.sh`).

## Secrets
`all-projects/vps-key/` holds deploy keys and tokens. It is git-ignored and excluded in `firebase.json`. Never commit it, print it, or remove that exclusion.
