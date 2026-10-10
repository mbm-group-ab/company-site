# MBM Software Development Website

A simple multilingual static company website for a software development business.

## Included
- English, Persian (Farsi), and Swedish language switcher
- Responsive one-page layout
- No build step required
- Ready to upload to any static host

## Files
- `index.html` — page structure
- `styles.css` — design and layout
- `script.js` — language switching
- `all-projects/projects.json` — central project catalog shown on the site
- `update-site.ps1` — validates the catalog and checks the catalog

## Local preview
Open the folder in a browser, or run:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Updating the project catalog

Add a project folder under `all-projects`, then add its object to `all-projects/projects.json`, including its description, icon, technologies, and optional public URL. Then run this from PowerShell:

```powershell
.\update-site.ps1
```

The script checks that each listed project folder exists and checks the catalog. The public catalog currently highlights Pishe (job-finder) at `https://job-finder.mbm-group.se/`.

## Hosting
Upload all files from this folder to the root of your static hosting account, such as cPanel, Netlify, Vercel static export, or any simple web host.

### Deployment
The site is served from the VPS (`static-sites` nginx container). `.github/workflows/deploy-vps.yml` copies the files there when the owner approves a deploy in MBM Control (`repository_dispatch` `deploy`); a push only runs the check job. It can also be started from the Actions tab.

The workflow needs the repo secrets `VPS_HOST`, `VPS_USER` and `VPS_SSH_KEY` (`owner-scripts/set-repo-secrets.sh`).

## Domains
This site is prepared to work for:
- mbm-family.ir
- mbm-computer.ir

You can point each domain to the same static host folder.
