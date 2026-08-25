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
- `projects.json` — central project catalog shown on the site
- `update-site.ps1` — validates the catalog and deploys the site to Firebase

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

Add a project object to `projects.json`, including its folder, description, technologies, and optional public URL. Then run this from PowerShell:

```powershell
.\update-site.ps1
```

The script checks that each listed project folder exists and deploys the updated site to Firebase Hosting. The public catalog currently highlights Job Finder AI at `https://job-finder.mbm-group.se/`.

## Hosting
Upload all files from this folder to the root of your static hosting account, such as cPanel, Netlify, Vercel static export, or any simple web host.

## Domains
This site is prepared to work for:
- mbm-family.ir
- mbm-computer.ir

You can point each domain to the same static host folder.
