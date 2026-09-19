# company-site

Static MBM company site (EN/FA/SV), no build step. Firebase Hosting project `mbm-group-ab`, branch `main`.

## Adding a project to the catalog
1. Create `all-projects/<directory>/` with a `logo.png` (256x256).
2. Add an object to `all-projects/projects.json` (`name`, `directory`, `icon`, `logo`, `category`, `description`, `url`, `repository`, `status`, `server`, `technologies`). Follow the existing entries.
3. Preview locally: `python -m http.server 8000` and open http://localhost:8000.

## Counts are derived automatically
The hero stats ("N Products", "Products live X/Y") and the project cards are rendered by `script.js` from `projects.json` at runtime. Never hardcode counts in `index.html` or the translations. `status: "live"` counts toward the live figure.

## Translations
All UI strings live in the `translations` object in `script.js` (`en`, `fa`, `sv`). Add every new key to all three.

## Deploy
- Pushing to `main` deploys automatically (`.github/workflows/deploy-firebase.yml`). Don't push without the user's review.
- `update-site.ps1` checks that every catalog directory exists, then runs `firebase deploy` from the local working tree.

## Secrets
`all-projects/vps-key/` holds deploy keys and tokens. It is git-ignored and excluded in `firebase.json`. Never commit it, print it, or remove that exclusion.
