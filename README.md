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

Add a project folder under `all-projects`, then add its object to `all-projects/projects.json`, including its description, icon, technologies, and optional public URL. Then run this from PowerShell:

```powershell
.\update-site.ps1
```

The script checks that each listed project folder exists and deploys the updated site to Firebase Hosting. The public catalog currently highlights Job Finder AI at `https://job-finder.mbm-group.se/`.

## Hosting
Upload all files from this folder to the root of your static hosting account, such as cPanel, Netlify, Vercel static export, or any simple web host.

### Automatic Firebase deployment
The GitHub Actions workflow in `.github/workflows/deploy-firebase.yml` deploys Firebase Hosting after every push to `main`. It can also be started manually from the Actions tab.

For the workflow to authenticate, add a repository secret named `FIREBASE_SERVICE_ACCOUNT` containing a Google Cloud service-account JSON key with permission to deploy Firebase Hosting. Never commit this JSON key to the repository.

## Domains
This site is prepared to work for:
- mbm-family.ir
- mbm-computer.ir

You can point each domain to the same static host folder.
