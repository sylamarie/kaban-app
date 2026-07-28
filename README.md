# Kaban

See [TECH-STACK.md](TECH-STACK.md) for the application architecture,
technology choices, data flow, and security boundaries.

Household money, in one place. A single-page budgeting app for one family, built to run from a static host and install on an iPad like a native app.

No build step. No `npm install`. `index.html` loads `app.jsx`, and the browser transpiles it.

---

## What's in here

| File | What it does |
|---|---|
| `index.html` | Page shell: meta tags, CDN scripts, service worker registration |
| `app.jsx` | The entire app, ~2,500 lines |
| `AGENTS.md` | Project instructions for coding agents (Codex, Claude Code) |
| `sw.js` | Service worker, so it works offline |
| `manifest.webmanifest` | Makes it installable |
| `icon-180.png`, `icon-512.png`, `icon-maskable.png` | Home screen icons |
| `supabase-schema.sql` | Run this only if you turn on cloud sync |

---

## 1. Put it on GitHub

**From a computer:** create a new repository named `kaban`, then drag every file in this folder onto the upload page. Commit.

**From the iPad:** create the repo on github.com, then use **Add file → Upload files**. Safari can upload from the Files app.

Keep the files at the top level of the repo, not inside a subfolder.

## 2. Make it live

In the repo: **Settings → Pages**. Under *Build and deployment*, set **Source: Deploy from a branch**, branch `main`, folder `/ (root)`. Save.

Give it a minute. Your URL will be:

```
https://YOUR-USERNAME.github.io/kaban/
```

GitHub Pages serves over HTTPS, which the app needs — offline mode and installing both require a secure origin.

## 3. Install on the iPad

1. Open the URL in **Safari** (not Chrome — only Safari can install to the Home Screen on iOS)
2. Tap the **Share** button
3. **Add to Home Screen**
4. Tap **Add**

You now have a Kaban icon. Opening it launches fullscreen with no browser bars. After the first load it works with no internet.

## 4. First run

The app asks for your household name and who's in it. Each adult who earns money gets their own card; children get a simplified one.

Prefer to look around first? Tap **Explore with sample data** to load a full fictional household. When you're ready for real data, go to **More → Backup and settings → Backup → Erase and set up again**.

---

## Do I need VS Code?

Not to run it — there's no compile step, the browser does everything.

You'll want an editor to **change** things. Options, easiest first:

- **github.dev** — press `.` on your repo page. Full VS Code in the browser, works on the iPad, commits directly. Nothing to install.
- **VS Code on a computer** — clone the repo, edit `index.html`, commit, push. To preview locally, run `python3 -m http.server 8080` in the folder and open `localhost:8080`. Opening the file directly with `file://` won't work: service workers need a real server.

All the app code is in `app.jsx`. `index.html` is a 60-line shell you will rarely touch.

**When you change `app.jsx` or `index.html`, also bump the cache name in `sw.js`** — change `kaban-v2` to `kaban-v3`, and so on. Otherwise devices keep serving the old copy from cache.

---

## Backups matter more than you think

Your records live in Safari's local storage. That's fast and private, but it is **not durable**: clearing Safari data erases it, and iOS can evict storage from sites you haven't opened in a long time.

So: **More → Backup and settings → Backup → Export a backup file**. Save it to iCloud Drive. Do it after closing each month — the app nudges you at that point, which lands roughly monthly.

That file is also how you move to a new device, and your way out if you ever leave this app.

---

## Cloud sync (optional)

This copy of Kaban is preconfigured with the project's public Supabase URL and
publishable key. These identify the backend but cannot bypass row level
security. Each household member still has to sign in before cloud data can be
read or written.

Only worth it if you want the same records on an iPad *and* a phone, or another family member entering expenses. One device is fine without it.

### Set it up

1. Create a free project at [supabase.com](https://supabase.com)
2. **SQL Editor** → paste `supabase-schema.sql` → **Run**
3. **Authentication → Providers** → make sure **Email** is enabled
4. **Authentication → URL Configuration** → add your GitHub Pages URL to *Redirect URLs*
5. **Project Settings → API Keys** → copy the **Project URL** and a **publishable** (`sb_publishable_...`) key
6. In Kaban: **More → Backup and settings → Sync** → paste both → **Connect** → enter your email → **Email me a sign-in link**
7. Open the link on that device

Repeat step 6–7 on each device, signing in with the same email.

### About that key in a public file

The publishable key is designed for public apps — it identifies the project but does not bypass access controls. What protects your data is **row level security**, which `supabase-schema.sql` turns on. The policies let each signed-in person read and write exactly one row: their own. Never put a secret or `service_role` key in Kaban.

**Don't skip the SQL file, and don't disable RLS.** Without it, the anon key alone would let anyone who found your URL read your household finances.

### How syncing behaves

The whole app state is one JSON document per account. On launch it pulls the cloud copy; edits push back after a short pause. Last write wins.

That means: if two devices edit while one is offline, the one that syncs last overwrites the other. Fine for a household where people take turns. Not fine for simultaneous editing — if you hit that, it's a sign you need a proper per-row backend.

---

## Known limits

- **Two months of history** are seeded in the sample; your own data starts from the month you set it up
- **No receipt photos.** Images need real storage — that's the Supabase Storage upgrade path
- **Recurring transactions, reminders and app lock** are stubbed in the More screen but not built
- **First load pulls ~3 MB** of React and Babel from a CDN. The service worker caches it, so it's a one-time cost per device
- **The month-close flow assumes one person does it.** No approval step

## Built with

React 18 and Babel Standalone from CDN, no bundler. Fonts are Archivo and Inter from Google Fonts, with system fallbacks if they don't load.
