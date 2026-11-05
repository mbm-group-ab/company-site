# company-site

Static MBM company site (EN/FA/SV), no build step. branch `main`. **Hosted on the VPS since 2026-10-10** (the Firebase Hosting sites of project `mbm-group-ab` vanished): container `static-sites` (nginx, 127.0.0.1:5090) serves this site, disk-recovery-tool and duplicompare; host nginx + certbot per domain; DNS A records in Cloudflare point at the VPS. Files in `deploy/static-sites/`; publish with `bash deploy/static-sites/sync.sh [site]`. The Firebase workflows (`deploy-firebase.yml`) no longer reach a live site. Health checks are set in the hub.

## Adding a project to the catalog
1. Create `all-projects/<directory>/` with a `logo.png` (256x256).
2. Add an object to `all-projects/projects.json` (`name`, `directory`, `icon`, `logo`, `category`, `description`, `url`, `repository`, `status`, `server`, `technologies`). Follow the existing entries. Write `category`/`description` in English and add `i18n.sv` and `i18n.fa` with the same two fields. `status`: `live`, `beta` or `coming-soon` (the last two show a pill on the card).
3. Preview locally: `python -m http.server 8000` and open http://localhost:8000.

## Counts are derived automatically
The hero stats ("N Products", "Products live X/Y") and the project cards are rendered by `script.js` from `projects.json` at runtime. Never hardcode counts in `index.html` or the translations. `status: "live"` counts toward the live figure.

## Translations
All UI strings live in the `translations` object in `script.js` (`en`, `fa`, `sv`); the project form and Sana chat keep theirs in `start-texts.js`, merged into `translations` at load. Add every new key to all three. `data-i18n` sets text, `data-i18n-placeholder` sets a placeholder; `applyLanguage` fires `mbm:language`.

## Start a project + Sana
- `#start` section: the request form (type, features, size, timeline, care, contact, consent, honeypot `website`) with a live rough price. `start.js` calls the Sana API (repo `sana`, `https://sana.mbm-group.se`, set in `#sana[data-api]`): `/v1/estimate`, `/v1/leads`, `/v1/chat`.
- Prices come only from the rate card in `sana/sana/rates.py`, never from the page or the AI.
- The Sana widget renders replies with `textContent` only and keeps the chat in `sessionStorage` (per tab). The privacy page describes what is stored.

## Deploy
- **Iranian domains** `mbm-family.ir` (ArvanCloud) and `mbm-computer.ir` (Cloudflare, another account): the same site from parvaz-ist (`/var/www/mbm-family`, nginx port 80, CDN does HTTPS). Publish with `bash deploy/static-sites/sync-ir.sh`. On any `.ir` host `script.js` shows Farsi only and removes the language switcher (owner's choice, 2026-11-05). Bump `script.js?v=` in `index.html` when script.js changes, or Arvan serves the cached copy.
- A push to `main` only runs `await-approval` in `.github/workflows/deploy-vps.yml`; the owner's 🚀 in MBM Control sends `repository_dispatch` `deploy`, which copies the site to the VPS (ssh + tar, `static-sites` container).
- `update-site.ps1` only checks that every catalog directory exists (no Firebase any more; deploy = the workflow, or `deploy/static-sites/sync.sh`).

## Secrets
`all-projects/vps-key/` holds deploy keys and tokens. It is git-ignored and excluded in `firebase.json`. Never commit it, print it, or remove that exclusion.
