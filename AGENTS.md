# AGENTS.md

Instructions for coding agents working on Kaban. Read this before changing anything.

---

## What this is

A household budgeting app for one family. Runs as a static page, installs to an iPad home screen, stores data locally with optional Supabase sync. Currency is Philippine pesos.

**Non-goals:** it is not a multi-tenant SaaS, not a bank integration, and not an accounting package. Keep it a small honest tool for one household.

---

## Hard constraints — read this twice

**1. There is no build step, and there must not be one.**
`app.jsx` is fetched by the browser and transpiled at runtime by Babel Standalone. Do not introduce Vite, webpack, npm, TypeScript, or a bundler. Do not create a `package.json`. The whole point is that the owner can edit one file, commit, and it is live.

**2. `app.jsx` is a classic script, not an ES module.**
No `import` or `export` statements — they will throw. React comes from UMD globals:

```js
const { useMemo, useState, useEffect, useRef } = React;
```

Everything lives in one shared scope. To add a library, add a `<script>` CDN tag to `index.html` and use its global. Ask before adding one.

**3. Bump the cache when you change the app.**
`sw.js` caches `index.html` and `app.jsx`. After any change, increment `CACHE` (`kaban-v2` → `kaban-v3`) or devices keep serving the old copy.

---

## Running it

```bash
python3 -m http.server 8080     # then open http://localhost:8080
```

Opening `index.html` with `file://` **will not work** — service workers and the Babel `src` fetch both need a real HTTP origin.

There is no test suite and no linter. Verify by hand against the checklist at the bottom.

---

## Files

| File | Contents |
|---|---|
| `app.jsx` | The entire application, ~2,500 lines |
| `index.html` | Shell: meta tags, boot styles, CDN scripts, service worker registration |
| `sw.js` | Offline cache |
| `manifest.webmanifest` | Install metadata |
| `supabase-schema.sql` | Table and row level security policies for sync |
| `icon-*.png` | Home screen icons |

`app.jsx` is laid out in this order: CSS string → icons → helpers → sample data → selectors → UI primitives → `Kaban` (state and actions) → screens → sheets → persistence → `Setup` → `Root` → mount.

---

## Data model

One JSON document holds everything. This is `data` in `Kaban`, and the thing exported, imported, and synced.

```js
{
  household: "Reyes household",
  people:  [{ id, name, role, kind: "adult"|"child"|"shared", admin?, c, i }],
  months:  [{ key: "2026-07", closed: false }],
  income:  [{ id, month, profile, source, amount, date, recurring? }],
  budgets: [{ id, month, name, amount, funding: [{ profile, amount }], carryOver?, forChild? }],
  expenses:[{ id, month, budget, name, amount, date, paidBy, shared, method, merchant, note? }],
  goals:   [{ id, name, target, opening, targetDate, forChild,
              contributions: [{ month, profile, amount, date }],
              transfersIn:   [{ month, from, amount, date }],
              withdrawals:   [] }],
  funds:   [{ id, name, target, opening, targetDate,
              contributions: [...], transfersIn: [...],
              project: [{ name, amount, date }] }],
  transfers:[{ id, month, date, from, to, amount }]
}
```

Nothing is stored pre-aggregated. Every total is derived:

- `useMonth(data, key)` — the month view model: budget rows with `spent`, `remaining`, `p` (percent used), `pace`, `expected`, `status`
- `goalSaved(g)` = `opening + contributions + transfersIn − withdrawals`
- `fundIn(f)` / `fundOut(f)` — contributed versus spent on the project
- `personStats(data, key, id)` — one member's month
- `feed(data, key)` — unified activity list

If you add a field, add it to the derivation rather than storing a total.

---

## Business rules — do not break these

These are the whole point of the app. A change that violates one is a bug even if the UI looks fine.

1. **A budget limit is not an expense.** Creating or funding a budget moves no money.
2. **Only recorded purchases count as expenses.** `totalSpent` is the sum of `expenses`, never of budget amounts.
3. **Every expense hits both** its budget's remaining balance and the month's expense total.
4. **Savings contributions reduce available balance but are not expenses.**
5. **Long-term fund contributions are not expenses.** Only entries in `fund.project` are spending.
6. **Transfers are never counted twice** and never change `totalSpent`. Moving a leftover budget balance into savings is a transfer, not a purchase.
7. **Every expense records who paid** (`paidBy`) and whether it is `shared` or personal.
8. **Leftover budget balances are reviewed when the month closes**, and can be carried over, moved to a goal or fund, split between two places, or returned to the available balance.
9. **Closed months are read only.** Guard writes with `locked`.
10. **The available balance formula is fixed:**

```
available = income − expenses − savings contributions − long-term contributions
```

`FormulaSheet` shows this to the user. If you change the calculation, change that sheet too.

---

## Design system

All colour, type and spacing live in CSS custom properties at the top of the `CSS` string in `app.jsx`. **Never hard-code a hex value in a component.**

- **Colour carries meaning, never decoration.** One navy accent (`--brand`), a four-step monochrome ramp for data (`--d1`…`--d4`), and semantic colours (`--pos`, `--warn`, `--neg`) only for status.
- **Type:** Archivo for figures and headings (`.kbn-n`, tabular numerals), Inter for text.
- **Currency:** `peso()` for lists and detail, `pesoK()` only where space is tight. Never mix them in one column.
- **Components to reuse:** `Meter`, `Track` (has a pace marker), `Ring`, `Tag`, `Avatar`, `Stack`, `Sheet`, `Field`, `Money`, `Segmented`, `Notice`, `Empty`.
- **Minimum tap target 44px.** Keep `:focus-visible` outlines. Respect `prefers-reduced-motion`.

### Writing style for UI copy

Plain words, sentence case, active voice. Name things the way the owner would: "Record a purchase", not "Submit transaction". Errors say what went wrong and how to fix it. Empty screens invite an action rather than apologising.

---

## Gotchas

- **`PEOPLE` is a module-level global**, reassigned from `data.people` at the top of every `Kaban` render. It lets small components call `who(id)` without prop drilling. Do not read it at module-evaluation time — it is empty until the first render.
- **Call all hooks before any early return.** Several sheets have empty-state guards; they sit after the `useState` calls on purpose.
- **Screens and sheets are top-level components taking a `ctx` prop.** Do not nest them inside `Kaban` — they would remount on every render and lose form state.
- **Every mutation captures `const prev = data;` before `setData`** and passes it to `say(msg, prev)`, which powers the undo button. Keep that pattern.
- **Storage keys** are `kaban.state.v1` and `kaban.cloud.v1`. If you change the data shape, add a migration inside `readLocal()` rather than bumping the key, or existing users lose everything.
- **`TODAY`** is a local-date ISO string. Do not use `new Date().toISOString()` directly; it shifts across the date line.
- **Sync writes the whole document, last write wins.** Do not add features that assume simultaneous multi-device editing without changing that first.

---

## Roadmap

Roughly in priority order.

1. **Edit and delete records.** Currently an expense can only be added, never corrected. This is the biggest gap for real daily use. Needs edit forms, a delete with undo, and a guard on closed months.
2. **Split one expense across several payers.** The data model needs `paidBy` to become an array of `{ profile, amount }`; migrate existing rows.
3. **Savings withdrawals.** `goal.withdrawals` exists in the model and in `goalSaved()`, but there is no UI.
4. **Recurring transactions.** Salary, rent, bills. Propose them at the start of a month and let the owner confirm before they are added — never add silently.
5. **Alerts and reminders.** Overspending, upcoming bills, missed contributions.
6. **Export to CSV and a printable monthly report.**
7. **Budget suggestions from history** once there are three months of data.
8. **Receipt photos.** Needs Supabase Storage; do not try to put images in localStorage.
9. **App lock.** PIN or biometric on open.

---

## Definition of done

Before calling a change finished, check all of these by hand:

- [ ] Loads from `python3 -m http.server` with no console errors
- [ ] Works on a **brand new household** — no income, no budgets, no goals, no funds
- [ ] Works on a **closed month** — nothing writable, no crashes
- [ ] The month-close flow still produces transfers, not expenses
- [ ] Available balance still equals income − expenses − savings − long-term
- [ ] Export → erase → restore round-trips without loss
- [ ] Usable at 375px wide
- [ ] `CACHE` bumped in `sw.js`
