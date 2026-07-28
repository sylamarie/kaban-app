# Kaban technology stack

Kaban is an offline-first household budgeting Progressive Web App. It uses a
small, no-build architecture so the owner can edit one application file and
publish it without a package manager or compilation pipeline.

## Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Interface | React 18 | Components, screens, sheets, forms, and state |
| Language | JavaScript and JSX | Application logic and UI markup |
| JSX runtime | Babel Standalone 7.28.5 | Transpiles `app.jsx` in the browser |
| Styling | CSS custom properties and custom CSS | Design tokens, layout, and responsive behavior |
| Local persistence | Browser `localStorage` | Immediate offline household state |
| Offline runtime | Service Worker and Cache API | Caches the application shell and assets |
| Installation | Web App Manifest | Adds Kaban to a phone or tablet home screen |
| Cloud database | Supabase Postgres | Stores one synchronized JSON document per signed-in user |
| Authentication | Supabase Auth | Passwordless email-link sign-in |
| Authorization | PostgreSQL Row Level Security | Restricts each user to their own database row |
| Cloud client | Supabase JavaScript UMD client | Pulls and pushes the household document |
| Source control | Git and GitHub | Version history and code hosting |
| Production hosting | GitHub Pages | Serves the static application over HTTPS |
| Local server | Python `http.server` | Runs the app locally without a build step |

## Data flow

```text
React UI
   |
   v
localStorage  <---- offline-first working copy
   |
   v
Supabase Auth + Postgres
   |
   `---- RLS: auth.uid() must match kaban_state.user_id
```

Kaban writes changes locally first. When the user is signed in and online, the
complete household document is synchronized to Supabase. Aggregates such as
spending, available balance, and savings are derived in the browser rather than
stored as separate totals.

## Main source files

| File | Purpose |
|---|---|
| `app.jsx` | Complete React application, CSS, state, forms, and sync logic |
| `index.html` | Document shell and CDN scripts |
| `sw.js` | Offline cache |
| `manifest.webmanifest` | PWA installation metadata |
| `supabase-schema.sql` | Database table, grants, and RLS policies |

## Security boundary

- The Supabase publishable key is safe for public browser code.
- Secret and `service_role` keys must never be placed in the app or repository.
- RLS is the database authorization boundary.
- Budget records are stored in Supabase and browser storage, not GitHub.
- The GitHub repository contains application source only.

## Intentional non-goals

Kaban does not use Node.js at runtime, npm dependencies, a `package.json`,
TypeScript, Vite, webpack, Next.js, or a custom application server. Adding any
of these would change the project's no-build maintenance model and requires an
explicit architectural decision.

