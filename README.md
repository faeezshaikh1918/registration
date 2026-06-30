# Registration Card — Entry Registry

A React (Vite) registration form with validation, a success toast, browser-storage
persistence, and a second "registry table" page to view, edit, and delete saved
entries.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

**Option A — Vercel CLI**
```bash
npm i -g vercel
vercel
```
Follow the prompts (Framework Preset: Vite, Build Command: `npm run build`,
Output Directory: `dist`). Then run `vercel --prod` to ship to production.

**Option B — Vercel dashboard**
1. Push this folder to a GitHub repo.
2. Go to vercel.com -> New Project -> import the repo.
3. Vercel auto-detects Vite. Keep the defaults (Build: `npm run build`,
   Output: `dist`) and click Deploy.

A `vercel.json` is already included so client-side routing (`/records`) works
correctly after deployment.

## Notes

- Data is stored in the browser's `localStorage`, so records persist across
  page reloads on the same device/browser, but are not shared between devices
  and are not sent to any server.
- Form fields: First name, Last name, Age, City, Country, Pin code, each with
  its own validation rules and inline error messages.
