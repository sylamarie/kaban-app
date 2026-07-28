/* ==========================================================================
   Kaban — household money, in one place.
   Loaded by index.html through Babel Standalone. No bundler, no build step:
   this file is fetched and transpiled in the browser, so plain JSX is fine
   but ES module `import` is not. Everything lives in one scope.
   ========================================================================== */
const { useMemo, useState, useEffect, useRef } = React;

/* ==========================================================================
   KABAN — household money management
   Prototype v2. Design system: neutral graphite surfaces, a single navy
   accent, and a monochrome data ramp so colour only ever carries meaning.
   Signature element: the allocation meter — one bar that shows where every
   peso of the month currently sits.
   ========================================================================== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

.kbn{
  --canvas:#E8EBEE;
  --card:#FFFFFF; --card-2:#F6F8FA; --card-3:#EDF1F5;
  --ink:#0B1114; --ink-2:#4A555E; --ink-3:#7C868E; --ink-4:#A3ACB3;
  --hair:#E1E6EA; --hair-2:#EDF1F4;
  --brand:#16324B; --brand-2:#234F6E; --brand-tint:#E9EFF4;
  --d1:#16324B; --d2:#3C6E92; --d3:#88ABC3; --d4:#D9E0E6;
  --pos:#0F6B4A; --pos-bg:#E7F2ED;
  --warn:#8A5E08; --warn-bg:#FAF0DB;
  --neg:#A3271D; --neg-bg:#F9E8E6;
  --sans:'Inter',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
  --disp:'Archivo','Inter',ui-sans-serif,system-ui,sans-serif;
  font-family:var(--sans);color:var(--ink);font-size:14px;line-height:1.45;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
}
.kbn *,.kbn *::before,.kbn *::after{box-sizing:border-box;}
.kbn button{font:inherit;color:inherit;background:none;border:none;padding:0;cursor:pointer;}
.kbn input,.kbn select{font:inherit;color:inherit;}
.kbn :focus-visible{outline:2px solid var(--brand-2);outline-offset:2px;border-radius:6px;}

/* ---------- stage ---------- */
.kbn-stage{
  min-height:100%;padding:28px 16px 44px;display:flex;flex-direction:column;align-items:center;gap:20px;
  background:
    radial-gradient(140% 90% at 50% -10%, #F3F5F7 0%, var(--canvas) 60%, #DFE3E7 100%);
}
.kbn-lockup{display:flex;align-items:center;gap:11px;}
.kbn-mark{
  width:30px;height:30px;border-radius:8px;background:var(--brand);position:relative;flex:0 0 auto;
}
.kbn-mark::after{
  content:"";position:absolute;left:5px;right:5px;top:11px;height:1.5px;background:rgba(255,255,255,.55);
}
.kbn-mark::before{
  content:"";position:absolute;left:12px;right:12px;top:14px;height:5px;border-radius:0 0 2px 2px;
  background:rgba(255,255,255,.35);
}
.kbn-word{font-family:var(--disp);font-weight:700;font-size:19px;letter-spacing:-.015em;}
.kbn-rule{width:1px;height:16px;background:#C7CED4;}
.kbn-claim{font-size:12.5px;color:var(--ink-2);}
.kbn-note{font-size:11.5px;color:var(--ink-3);text-align:center;max-width:412px;line-height:1.65;}
.kbn-note b{color:var(--ink-2);font-weight:600;}

/* ---------- device ---------- */
.kbn-device{
  width:100%;max-width:412px;height:min(848px,88vh);min-height:620px;background:var(--card);
  border:1px solid #D3DAE0;border-radius:24px;overflow:hidden;position:relative;
  display:flex;flex-direction:column;
  box-shadow:0 30px 64px -34px rgba(11,17,20,.5),0 2px 4px rgba(11,17,20,.05);
}

/* ---------- app bar ---------- */
.kbn-bar{
  flex:0 0 auto;padding:15px 16px 12px;background:var(--card);border-bottom:1px solid var(--hair-2);
  display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:62px;
}
.kbn-bartitle{font-family:var(--disp);font-weight:600;font-size:18px;letter-spacing:-.015em;}
.kbn-barsub{font-size:11.5px;color:var(--ink-3);margin-top:1px;display:flex;align-items:center;gap:5px;}
.kbn-monthbtn{
  display:flex;align-items:center;gap:6px;padding:7px 10px;border:1px solid var(--hair);border-radius:9px;
  background:var(--card-2);font-size:12.5px;font-weight:500;min-height:36px;
}
.kbn-monthbtn:hover{background:var(--card-3);}
.kbn-iconbtn{
  width:34px;height:34px;border-radius:9px;display:grid;place-items:center;color:var(--ink-2);
  border:1px solid var(--hair);background:var(--card-2);
}
.kbn-iconbtn[disabled]{opacity:.35;cursor:default;}

/* ---------- scroll ---------- */
.kbn-scroll{flex:1 1 auto;overflow-y:auto;overscroll-behavior:contain;padding:16px 16px 104px;}
.kbn-scroll::-webkit-scrollbar{width:0;}

/* ---------- tabs ---------- */
.kbn-tabs{
  position:absolute;left:0;right:0;bottom:0;display:grid;grid-template-columns:repeat(5,1fr);
  background:rgba(255,255,255,.96);backdrop-filter:blur(10px);border-top:1px solid var(--hair);
  padding:5px 4px calc(6px + env(safe-area-inset-bottom));
}
.kbn-tab{display:flex;flex-direction:column;align-items:center;gap:3px;padding:7px 0 5px;color:var(--ink-4);min-height:46px;}
.kbn-tab span{font-size:9.5px;font-weight:500;letter-spacing:.01em;}
.kbn-tab[data-on="1"]{color:var(--brand);}
.kbn-tab[data-on="1"] span{font-weight:600;}
.kbn-fab{
  position:absolute;right:16px;bottom:78px;height:44px;padding:0 16px;border-radius:12px;
  background:var(--brand);color:#fff;display:flex;align-items:center;gap:7px;font-size:13.5px;font-weight:600;
  box-shadow:0 10px 22px -10px rgba(22,50,75,.75);
}
.kbn-fab:hover{background:var(--brand-2);}
.kbn-fab[disabled]{background:var(--ink-4);box-shadow:none;cursor:default;}

/* ---------- type ---------- */
.kbn-eyebrow{font-size:10.5px;font-weight:600;letter-spacing:.085em;text-transform:uppercase;color:var(--ink-3);}
.kbn-n{font-family:var(--disp);font-variant-numeric:tabular-nums;font-feature-settings:'tnum' 1;letter-spacing:-.015em;font-weight:600;}
.kbn-t{font-size:14px;font-weight:600;letter-spacing:-.005em;}
.kbn-s{font-size:12.5px;color:var(--ink-2);line-height:1.55;}
.kbn-m{font-size:11.5px;color:var(--ink-3);}

/* ---------- blocks ---------- */
.kbn-card{background:var(--card);border:1px solid var(--hair);border-radius:12px;}
.kbn-pad{padding:15px;}
.kbn-sec{margin-top:22px;}
.kbn-sechead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;}
.kbn-more{font-size:12px;font-weight:600;color:var(--brand-2);display:inline-flex;align-items:center;gap:3px;}

/* ---------- allocation meter ---------- */
.kbn-meter{display:flex;height:12px;border-radius:3px;overflow:hidden;background:var(--card-3);}
.kbn-meter span{display:block;transition:width .8s cubic-bezier(.2,.8,.2,1);}
.kbn-legend{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--hair-2);border-radius:9px;overflow:hidden;margin-top:14px;}
.kbn-leg{background:var(--card);padding:10px 11px;}
.kbn-legtop{display:flex;align-items:center;gap:6px;}
.kbn-sw{width:8px;height:8px;border-radius:2px;flex:0 0 auto;}
.kbn-legname{font-size:11px;color:var(--ink-2);font-weight:500;}
.kbn-legval{font-size:15px;margin-top:3px;}
.kbn-legpct{font-size:10.5px;color:var(--ink-4);margin-left:5px;font-weight:500;}

/* ---------- track ---------- */
.kbn-track{position:relative;border-radius:3px;background:var(--card-3);overflow:visible;}
.kbn-track > .fill{display:block;height:100%;border-radius:3px;transition:width .7s cubic-bezier(.2,.8,.2,1);}
.kbn-track > .pace{
  position:absolute;top:-3px;bottom:-3px;width:1.5px;background:var(--ink-3);opacity:.55;border-radius:2px;
}
.kbn-clip{border-radius:3px;overflow:hidden;height:100%;}

/* ---------- rows ---------- */
.kbn-list{background:var(--card);border:1px solid var(--hair);border-radius:12px;overflow:hidden;}
.kbn-row{
  display:flex;align-items:center;gap:12px;padding:12px 14px;width:100%;text-align:left;
  border-bottom:1px solid var(--hair-2);min-height:52px;background:var(--card);
}
.kbn-row:last-child{border-bottom:none;}
button.kbn-row:hover{background:var(--card-2);}
.kbn-rowmain{flex:1 1 auto;min-width:0;}
.kbn-rowmain .kbn-t{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.kbn-rowend{text-align:right;flex:0 0 auto;}
.kbn-av{
  width:28px;height:28px;border-radius:8px;flex:0 0 auto;display:grid;place-items:center;
  font-size:11px;font-weight:600;color:#fff;font-family:var(--disp);
}
.kbn-glyph{
  width:28px;height:28px;border-radius:8px;flex:0 0 auto;display:grid;place-items:center;
  background:var(--card-3);color:var(--ink-2);
}
.kbn-daybar{
  display:flex;align-items:baseline;justify-content:space-between;padding:9px 14px 7px;
  background:var(--card-2);border-bottom:1px solid var(--hair-2);
}

/* ---------- chips / segmented ---------- */
.kbn-seg{display:flex;gap:3px;background:var(--card-3);padding:3px;border-radius:10px;}
.kbn-segb{
  flex:1 1 0;padding:8px 6px;border-radius:8px;font-size:12.5px;font-weight:500;color:var(--ink-2);
  min-height:36px;
}
.kbn-segb[data-on="1"]{background:var(--card);color:var(--ink);font-weight:600;box-shadow:0 1px 2px rgba(11,17,20,.09);}
.kbn-chips{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px;}
.kbn-chips::-webkit-scrollbar{height:0;}
.kbn-chip{
  border:1px solid var(--hair);border-radius:8px;padding:7px 11px;font-size:12px;white-space:nowrap;
  color:var(--ink-2);background:var(--card);min-height:34px;
}
.kbn-chip[data-on="1"]{background:var(--brand);border-color:var(--brand);color:#fff;font-weight:500;}
.kbn-tag{
  display:inline-block;font-size:10px;font-weight:600;letter-spacing:.045em;text-transform:uppercase;
  padding:3px 7px;border-radius:5px;white-space:nowrap;
}

/* ---------- search ---------- */
.kbn-search{display:flex;align-items:center;gap:8px;border:1px solid var(--hair);border-radius:10px;padding:0 11px;background:var(--card-2);height:40px;}
.kbn-search input{flex:1;border:none;background:none;outline:none;font-size:13px;}
.kbn-search input::placeholder{color:var(--ink-4);}

/* ---------- notices ---------- */
.kbn-notice{display:flex;gap:11px;align-items:flex-start;padding:13px 14px;border-radius:11px;border:1px solid var(--hair);background:var(--card-2);}
.kbn-notice.warn{background:var(--warn-bg);border-color:#EEDCB5;}
.kbn-notice.neg{background:var(--neg-bg);border-color:#EFCFCB;}
.kbn-notice.info{background:var(--brand-tint);border-color:#CFDDE8;}
.kbn-act{margin-top:8px;display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:var(--brand-2);}

/* ---------- buttons ---------- */
.kbn-btn{
  display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:46px;padding:0 16px;
  border-radius:11px;background:var(--brand);color:#fff;font-size:14px;font-weight:600;
}
.kbn-btn:hover{background:var(--brand-2);}
.kbn-btn[disabled]{background:var(--card-3);color:var(--ink-4);cursor:default;}
.kbn-btn.ghost{background:var(--card);border:1px solid var(--hair);color:var(--ink);}
.kbn-btn.ghost:hover{background:var(--card-2);}

/* ---------- sheet ---------- */
.kbn-scrim{position:absolute;inset:0;background:rgba(11,17,20,.44);z-index:40;animation:kfade .2s ease;}
@keyframes kfade{from{opacity:0}to{opacity:1}}
.kbn-sheet{
  position:absolute;left:0;right:0;bottom:0;top:22px;z-index:41;background:var(--card-2);
  border-radius:18px 18px 0 0;display:flex;flex-direction:column;overflow:hidden;
  box-shadow:0 -8px 32px -12px rgba(11,17,20,.4);animation:kup .28s cubic-bezier(.2,.9,.25,1);
}
@keyframes kup{from{transform:translateY(12%)}to{transform:none}}
.kbn-grab{width:34px;height:4px;border-radius:2px;background:var(--hair);margin:8px auto 0;flex:0 0 auto;}
.kbn-sheethead{display:flex;align-items:center;gap:12px;padding:10px 16px 13px;border-bottom:1px solid var(--hair);background:var(--card-2);flex:0 0 auto;}
.kbn-sheettitle{font-family:var(--disp);font-weight:600;font-size:16.5px;letter-spacing:-.01em;flex:1;}
.kbn-sheetbody{flex:1 1 auto;overflow-y:auto;padding:16px;}
.kbn-sheetbody::-webkit-scrollbar{width:0;}
.kbn-sheetfoot{
  flex:0 0 auto;padding:12px 16px calc(14px + env(safe-area-inset-bottom));
  border-top:1px solid var(--hair);background:var(--card);
}

/* ---------- form ---------- */
.kbn-field{margin-bottom:14px;}
.kbn-label{display:block;font-size:11.5px;font-weight:600;color:var(--ink-2);margin-bottom:6px;}
.kbn-in{
  width:100%;min-height:44px;padding:10px 12px;border:1px solid var(--hair);border-radius:10px;
  background:var(--card);font-size:14px;
}
.kbn-in:focus{border-color:var(--brand-2);outline:none;box-shadow:0 0 0 3px rgba(35,79,110,.12);}
.kbn-money{display:flex;align-items:center;border:1px solid var(--hair);border-radius:10px;background:var(--card);padding-left:12px;min-height:44px;}
.kbn-money span{color:var(--ink-3);font-family:var(--disp);font-weight:600;}
.kbn-money input{flex:1;border:none;background:none;outline:none;padding:10px 12px 10px 4px;font-family:var(--disp);font-weight:600;font-variant-numeric:tabular-nums;font-size:15px;}
.kbn-2{display:grid;grid-template-columns:1fr 1fr;gap:11px;}
.kbn-3{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;}

/* ---------- misc ---------- */
.kbn-empty{text-align:center;padding:38px 22px;}
.kbn-empty .kbn-t{margin-bottom:5px;}
.kbn-kv{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--hair-2);}
.kbn-kv:last-child{border-bottom:none;}
.kbn-kv > span:first-child{font-size:12.5px;color:var(--ink-2);}
.kbn-toast{
  position:absolute;left:16px;right:16px;bottom:136px;z-index:50;background:var(--ink);color:#fff;
  border-radius:11px;padding:12px 14px;font-size:12.5px;display:flex;gap:10px;align-items:center;
  box-shadow:0 12px 28px -12px rgba(11,17,20,.7);animation:kup .22s ease;
}
.kbn-toast > span{flex:1;line-height:1.4;}
.kbn-toast button{font-size:11.5px;font-weight:700;letter-spacing:.06em;color:#9FC6E4;flex:0 0 auto;}

@media (prefers-reduced-motion:reduce){.kbn *{animation:none !important;transition:none !important;}}
`;

/* -------------------------------- icons ---------------------------------- */

const PATHS = {
  overview: ["M3.5 11 12 4l8.5 7", "M5.5 9.6V20h13V9.6", "M9.8 20v-5.4h4.4V20"],
  budgets: ["M4 6h16v13H4z", "M4 10h16", "M15.5 14.5h2"],
  goals: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 16.4a4.4 4.4 0 1 0 0-8.8 4.4 4.4 0 0 0 0 8.8z", "M12 13.1a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2z"],
  activity: ["M3 12h4l2.5-6 4 13 2.5-7H21"],
  more: ["M4 12h16", "M4 6h16", "M4 18h16"],
  plus: ["M12 5.5v13", "M5.5 12h13"],
  left: ["M14.5 18.5 8 12l6.5-6.5"],
  right: ["M9.5 5.5 16 12l-6.5 6.5"],
  down: ["M6 9.5l6 6 6-6"],
  x: ["M18 6 6 18", "M6 6l12 12"],
  check: ["M20 6.5 9.2 17.3 4 12.1"],
  alert: ["M12 3.5 2.2 20.5h19.6z", "M12 10v4.2", "M12 17.4h.01"],
  lock: ["M5.5 10.5h13V21h-13z", "M8.6 10.5V7.2a3.4 3.4 0 0 1 6.8 0v3.3"],
  arrow: ["M4.5 12h14", "M13 6.5l6 5.5-6 5.5"],
  chart: ["M3.5 20.5h17", "M7 20.5v-6.5", "M12 20.5V6", "M17 20.5v-10"],
  people: ["M15.5 20.5v-1.7a3.6 3.6 0 0 0-3.6-3.6H6.6A3.6 3.6 0 0 0 3 18.8v1.7", "M9.2 11.8a3.9 3.9 0 1 0 0-7.8 3.9 3.9 0 0 0 0 7.8", "M21 20.5v-1.7a3.6 3.6 0 0 0-2.7-3.5", "M16 4.2a3.6 3.6 0 0 1 0 7"],
  swap: ["M4 8.5h13", "M14 5l3.5 3.5L14 12", "M20 15.5H7", "M10 12l-3.5 3.5L10 19"],
  calendar: ["M4 6.5h16v14H4z", "M4 10.5h16", "M8.5 3.5v4", "M15.5 3.5v4"],
  search: ["M11 18.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z", "M16.5 16.5 21 21"],
  wallet: ["M3.5 7.5A2 2 0 0 1 5.5 5.5h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z", "M16.5 12h1.5"],
  export: ["M12 15.5V4", "M8.2 7.8 12 4l3.8 3.8", "M4.5 15v4.5h15V15"],
  bell: ["M18 8.8a6 6 0 1 0-12 0c0 5.2-2 6.7-2 6.7h16s-2-1.5-2-6.7", "M13.7 19.2a2 2 0 0 1-3.4 0"],
  shield: ["M12 3.5 5 6.2v5.3c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6.2z"],
  vault: ["M4 5.5h16v13H4z", "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z", "M12 12h.01"],
  trend: ["M4 16.5 9.5 11l3.5 3.5 6.5-6.5", "M15 8h4.5v4.5"],
};

function Ic({ n, s = 18, w = 1.6, style, cls }) {
  return (
    <svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true" focusable="false">
      {(PATHS[n] || []).map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

/* ------------------------------- helpers --------------------------------- */

const TODAY = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const MN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const peso = (n) => (n < 0 ? "−₱" : "₱") + Math.round(Math.abs(n)).toLocaleString("en-US");
const pesoK = (n) => {
  const a = Math.abs(n);
  if (a >= 1e6) return "₱" + (n / 1e6).toFixed(a % 1e6 === 0 ? 0 : 1) + "M";
  if (a >= 1e4) return "₱" + Math.round(n / 1e3) + "k";
  return peso(n);
};
const pct = (n) => Math.round(n * 100) + "%";
const sum = (a, k = "amount") => a.reduce((t, x) => t + (k ? x[k] : x), 0);
const uid = (p) => p + "-" + Math.random().toString(36).slice(2, 8);
const dayShort = (iso) => MS[Number(iso.slice(5, 7)) - 1] + " " + Number(iso.slice(8, 10));
const dayLong = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()] + ", " + dayShort(iso);
};
const monthLong = (k) => MN[Number(k.slice(5, 7)) - 1] + " " + k.slice(0, 4);
const monthShort = (k) => MS[Number(k.slice(5, 7)) - 1];
const daysIn = (k) => new Date(Number(k.slice(0, 4)), Number(k.slice(5, 7)), 0).getDate();
const nextKey = (k) => {
  const y = Number(k.slice(0, 4)), m = Number(k.slice(5, 7));
  return (m === 12 ? y + 1 : y) + "-" + String(m === 12 ? 1 : m + 1).padStart(2, "0");
};
const paceOf = (k) => {
  const now = TODAY.slice(0, 7);
  if (k < now) return 1;
  if (k > now) return 0;
  return Number(TODAY.slice(8, 10)) / daysIn(k);
};

/* ------------------------------ seed data -------------------------------- */

/* PEOPLE mirrors data.people. It is refreshed at the top of every app render
   so the many small components can read it without prop drilling. */
let PEOPLE = [];
const who = (id) => PEOPLE.find((p) => p.id === id) || { name: id, c: "#7C868E", i: "?", role: "" };

const SAMPLE = {
  household: "Reyes household",
  people: [
    { id: "maria", name: "Maria", role: "Mother", kind: "adult", admin: true, c: "#16324B", i: "MR" },
    { id: "ramon", name: "Ramon", role: "Father", kind: "adult", c: "#3C6E92", i: "RR" },
    { id: "ana", name: "Ana", role: "Child, 9", kind: "child", c: "#88ABC3", i: "AR" },
    { id: "house", name: "Household", role: "Shared pot", kind: "shared", c: "#7C868E", i: "HH" },
  ],
  months: [{ key: "2026-06", closed: true }, { key: "2026-07", closed: false }],
  income: [
    { id: "i1", month: "2026-06", profile: "maria", source: "Salary", amount: 38000, date: "2026-06-15", recurring: true },
    { id: "i2", month: "2026-06", profile: "maria", source: "Freelance design", amount: 2000, date: "2026-06-20" },
    { id: "i3", month: "2026-06", profile: "ramon", source: "Salary", amount: 45000, date: "2026-06-15", recurring: true },
    { id: "i4", month: "2026-06", profile: "ramon", source: "Sales commission", amount: 3000, date: "2026-06-28" },
    { id: "i5", month: "2026-07", profile: "maria", source: "Salary", amount: 38000, date: "2026-07-15", recurring: true },
    { id: "i6", month: "2026-07", profile: "maria", source: "Freelance design", amount: 2000, date: "2026-07-22" },
    { id: "i7", month: "2026-07", profile: "ramon", source: "Salary", amount: 45000, date: "2026-07-15", recurring: true },
    { id: "i8", month: "2026-07", profile: "ramon", source: "Sales commission", amount: 5000, date: "2026-07-24" },
  ],
  budgets: [
    { id: "b6g", month: "2026-06", name: "Groceries", amount: 5000, funding: [{ profile: "maria", amount: 3000 }, { profile: "ramon", amount: 2000 }] },
    { id: "b6u", month: "2026-06", name: "Utilities", amount: 6000, funding: [{ profile: "maria", amount: 2500 }, { profile: "ramon", amount: 3500 }] },
    { id: "b6t", month: "2026-06", name: "Transportation", amount: 3000, funding: [{ profile: "maria", amount: 1000 }, { profile: "ramon", amount: 2000 }] },
    { id: "b6c", month: "2026-06", name: "Child expenses", forChild: true, amount: 4000, funding: [{ profile: "maria", amount: 2000 }, { profile: "ramon", amount: 2000 }] },
    { id: "b7g", month: "2026-07", name: "Groceries", amount: 5000, funding: [{ profile: "maria", amount: 3000 }, { profile: "ramon", amount: 2000 }] },
    { id: "b7a", month: "2026-07", name: "Appliances", amount: 10000, funding: [{ profile: "ramon", amount: 10000 }] },
    { id: "b7u", month: "2026-07", name: "Utilities", amount: 6000, funding: [{ profile: "maria", amount: 2500 }, { profile: "ramon", amount: 3500 }] },
    { id: "b7t", month: "2026-07", name: "Transportation", amount: 3000, funding: [{ profile: "maria", amount: 1000 }, { profile: "ramon", amount: 2000 }] },
    { id: "b7c", month: "2026-07", name: "Child expenses", forChild: true, amount: 4000, funding: [{ profile: "maria", amount: 2000 }, { profile: "ramon", amount: 2000 }] },
    { id: "b7h", month: "2026-07", name: "Healthcare", amount: 2000, funding: [{ profile: "ramon", amount: 2000 }] },
    { id: "b7e", month: "2026-07", name: "Entertainment", amount: 1500, funding: [{ profile: "maria", amount: 750 }, { profile: "ramon", amount: 750 }] },
  ],
  expenses: [
    { id: "e01", month: "2026-06", budget: "b6g", name: "Rice, 25kg", amount: 800, date: "2026-06-02", paidBy: "maria", shared: true, method: "Cash", merchant: "Puregold" },
    { id: "e02", month: "2026-06", budget: "b6g", name: "Meat and chicken", amount: 1200, date: "2026-06-06", paidBy: "maria", shared: true, method: "Cash", merchant: "Public market" },
    { id: "e03", month: "2026-06", budget: "b6g", name: "Vegetables", amount: 650, date: "2026-06-06", paidBy: "maria", shared: true, method: "Cash", merchant: "Public market" },
    { id: "e04", month: "2026-06", budget: "b6g", name: "Toiletries", amount: 500, date: "2026-06-13", paidBy: "ramon", shared: true, method: "GCash", merchant: "Watsons" },
    { id: "e05", month: "2026-06", budget: "b6g", name: "Fish", amount: 900, date: "2026-06-18", paidBy: "ramon", shared: true, method: "Cash", merchant: "Public market" },
    { id: "e06", month: "2026-06", budget: "b6g", name: "Bread and snacks", amount: 600, date: "2026-06-24", paidBy: "maria", shared: true, method: "Cash", merchant: "Bakery" },
    { id: "e07", month: "2026-06", budget: "b6u", name: "Electricity", amount: 3200, date: "2026-06-08", paidBy: "ramon", shared: true, method: "GCash", merchant: "Meralco" },
    { id: "e08", month: "2026-06", budget: "b6u", name: "Water", amount: 850, date: "2026-06-08", paidBy: "ramon", shared: true, method: "GCash", merchant: "Water district" },
    { id: "e09", month: "2026-06", budget: "b6u", name: "Internet", amount: 1850, date: "2026-06-10", paidBy: "maria", shared: true, method: "Card", merchant: "PLDT" },
    { id: "e10", month: "2026-06", budget: "b6t", name: "Fuel", amount: 1500, date: "2026-06-05", paidBy: "ramon", shared: true, method: "Card", merchant: "Shell" },
    { id: "e11", month: "2026-06", budget: "b6t", name: "Jeepney and tricycle fares", amount: 400, date: "2026-06-14", paidBy: "maria", shared: false, method: "Cash", merchant: "—" },
    { id: "e12", month: "2026-06", budget: "b6t", name: "Parking", amount: 500, date: "2026-06-21", paidBy: "ramon", shared: false, method: "Cash", merchant: "—" },
    { id: "e13", month: "2026-06", budget: "b6c", name: "Tuition, first instalment", amount: 2500, date: "2026-06-03", paidBy: "ramon", shared: true, method: "Bank transfer", merchant: "St. Anne School" },
    { id: "e14", month: "2026-06", budget: "b6c", name: "School shoes", amount: 1100, date: "2026-06-09", paidBy: "maria", shared: true, method: "Cash", merchant: "Marikina shoe store" },
    { id: "e15", month: "2026-06", budget: "b6c", name: "Medicine", amount: 550, date: "2026-06-26", paidBy: "maria", shared: true, method: "Cash", merchant: "Mercury Drug" },
    { id: "e16", month: "2026-07", budget: "b7g", name: "Rice, 25kg", amount: 800, date: "2026-07-02", paidBy: "maria", shared: true, method: "Cash", merchant: "Puregold" },
    { id: "e17", month: "2026-07", budget: "b7g", name: "Meat and chicken", amount: 1000, date: "2026-07-05", paidBy: "maria", shared: true, method: "Cash", merchant: "Public market" },
    { id: "e18", month: "2026-07", budget: "b7g", name: "Vegetables", amount: 500, date: "2026-07-05", paidBy: "maria", shared: true, method: "Cash", merchant: "Public market" },
    { id: "e19", month: "2026-07", budget: "b7g", name: "Toiletries", amount: 400, date: "2026-07-09", paidBy: "ramon", shared: true, method: "GCash", merchant: "Watsons" },
    { id: "e20", month: "2026-07", budget: "b7g", name: "Fish", amount: 700, date: "2026-07-16", paidBy: "maria", shared: true, method: "Cash", merchant: "Public market" },
    { id: "e21", month: "2026-07", budget: "b7g", name: "Coffee and milk", amount: 400, date: "2026-07-21", paidBy: "ramon", shared: true, method: "Card", merchant: "SM Supermarket" },
    { id: "e22", month: "2026-07", budget: "b7a", name: "Refrigerator", amount: 7000, date: "2026-07-15", paidBy: "ramon", shared: true, method: "Cash", merchant: "Abenson", note: "Kitchen refrigerator" },
    { id: "e23", month: "2026-07", budget: "b7u", name: "Electricity", amount: 2800, date: "2026-07-08", paidBy: "ramon", shared: true, method: "GCash", merchant: "Meralco" },
    { id: "e24", month: "2026-07", budget: "b7u", name: "Water", amount: 850, date: "2026-07-08", paidBy: "ramon", shared: true, method: "GCash", merchant: "Water district" },
    { id: "e25", month: "2026-07", budget: "b7u", name: "Internet", amount: 1850, date: "2026-07-10", paidBy: "maria", shared: true, method: "Card", merchant: "PLDT" },
    { id: "e26", month: "2026-07", budget: "b7t", name: "Fuel", amount: 1200, date: "2026-07-04", paidBy: "ramon", shared: true, method: "Card", merchant: "Shell" },
    { id: "e27", month: "2026-07", budget: "b7t", name: "Jeepney and tricycle fares", amount: 350, date: "2026-07-12", paidBy: "maria", shared: false, method: "Cash", merchant: "—" },
    { id: "e28", month: "2026-07", budget: "b7t", name: "Parking", amount: 300, date: "2026-07-18", paidBy: "ramon", shared: false, method: "Cash", merchant: "—" },
    { id: "e29", month: "2026-07", budget: "b7c", name: "School supplies", amount: 1200, date: "2026-07-06", paidBy: "maria", shared: true, method: "Cash", merchant: "National Book Store" },
    { id: "e30", month: "2026-07", budget: "b7c", name: "School uniform", amount: 1500, date: "2026-07-11", paidBy: "maria", shared: true, method: "Cash", merchant: "Uniform shop" },
    { id: "e31", month: "2026-07", budget: "b7c", name: "Medicine", amount: 500, date: "2026-07-20", paidBy: "ramon", shared: true, method: "Cash", merchant: "Mercury Drug" },
    { id: "e32", month: "2026-07", budget: "b7e", name: "Streaming subscriptions", amount: 540, date: "2026-07-01", paidBy: "ramon", shared: false, method: "Card", merchant: "—" },
    { id: "e33", month: "2026-07", budget: "b7e", name: "Movie tickets", amount: 760, date: "2026-07-11", paidBy: "ramon", shared: true, method: "Card", merchant: "SM Cinema" },
    { id: "e34", month: "2026-07", budget: "b7e", name: "Family dinner", amount: 500, date: "2026-07-19", paidBy: "maria", shared: true, method: "Cash", merchant: "Jollibee" },
  ],
  goals: [
    { id: "g1", name: "Emergency fund", target: 200000, opening: 57650, targetDate: "Dec 2027", forChild: false,
      contributions: [
        { month: "2026-06", profile: "maria", amount: 2000, date: "2026-06-16" },
        { month: "2026-06", profile: "ramon", amount: 3000, date: "2026-06-16" },
        { month: "2026-07", profile: "maria", amount: 2000, date: "2026-07-16" },
        { month: "2026-07", profile: "ramon", amount: 3000, date: "2026-07-16" }],
      transfersIn: [{ month: "2026-07", from: "June groceries balance", amount: 350, date: "2026-07-01" }], withdrawals: [] },
    { id: "g2", name: "Ana's education", target: 500000, opening: 111400, targetDate: "Jun 2035", forChild: true,
      contributions: [
        { month: "2026-06", profile: "maria", amount: 1500, date: "2026-06-16" },
        { month: "2026-06", profile: "ramon", amount: 2500, date: "2026-06-16" },
        { month: "2026-07", profile: "maria", amount: 1500, date: "2026-07-16" },
        { month: "2026-07", profile: "ramon", amount: 2500, date: "2026-07-16" }],
      transfersIn: [{ month: "2026-07", from: "June transportation balance", amount: 600, date: "2026-07-01" }], withdrawals: [] },
    { id: "g3", name: "Family vacation", target: 80000, opening: 22500, targetDate: "Apr 2027", forChild: false,
      contributions: [], transfersIn: [], withdrawals: [] },
  ],
  funds: [
    { id: "f1", name: "7-Eleven franchise", target: 5000000, opening: 980000, targetDate: "Dec 2030",
      contributions: [
        { month: "2026-06", profile: "maria", amount: 4000, date: "2026-06-17" },
        { month: "2026-06", profile: "ramon", amount: 6000, date: "2026-06-17" },
        { month: "2026-07", profile: "maria", amount: 4000, date: "2026-07-17" },
        { month: "2026-07", profile: "ramon", amount: 6000, date: "2026-07-17" }],
      transfersIn: [],
      project: [
        { name: "Franchise application fee", amount: 120000, date: "2026-03-11" },
        { name: "Site survey", amount: 30000, date: "2026-04-08" },
        { name: "Legal and permits", amount: 50000, date: "2026-05-19" }] },
    { id: "f2", name: "House construction", target: 1500000, opening: 340000, targetDate: "Dec 2032",
      contributions: [], transfersIn: [], project: [] },
  ],
  transfers: [
    { id: "t1", month: "2026-07", date: "2026-07-01", from: "Groceries budget, June", to: "Emergency fund", amount: 350 },
    { id: "t2", month: "2026-07", date: "2026-07-01", from: "Transportation budget, June", to: "Ana's education", amount: 600 },
    { id: "t3", month: "2026-07", date: "2026-07-01", from: "Utilities budget, June", to: "Maria's available balance", amount: 100 },
    { id: "t4", month: "2026-07", date: "2026-07-01", from: "Household available balance", to: "Child expenses budget, June", amount: 150 },
  ],
};

/* ------------------------------ selectors -------------------------------- */

function statusOf(p, spent) {
  if (spent === 0) return { t: "Untouched", fg: "var(--ink-3)", bg: "var(--card-3)" };
  if (p > 1) return { t: "Over", fg: "var(--neg)", bg: "var(--neg-bg)" };
  if (p === 1) return { t: "Fully used", fg: "var(--ink-2)", bg: "var(--card-3)" };
  if (p >= 0.9) return { t: "Nearly used", fg: "var(--warn)", bg: "var(--warn-bg)" };
  if (p >= 0.75) return { t: "75% used", fg: "var(--warn)", bg: "var(--warn-bg)" };
  if (p >= 0.5) return { t: "Half used", fg: "var(--brand-2)", bg: "var(--brand-tint)" };
  return { t: "On track", fg: "var(--pos)", bg: "var(--pos-bg)" };
}

function useMonth(data, key) {
  return useMemo(() => {
    const income = data.income.filter((x) => x.month === key);
    const expenses = data.expenses.filter((x) => x.month === key);
    const savingsC = data.goals.flatMap((g) => g.contributions).filter((c) => c.month === key);
    const fundC = data.funds.flatMap((f) => f.contributions).filter((c) => c.month === key);
    const pace = paceOf(key);
    const rows = data.budgets.filter((b) => b.month === key).map((b) => {
      const tx = expenses.filter((e) => e.budget === b.id).sort((a, z) => (a.date < z.date ? 1 : -1));
      const spent = sum(tx);
      const pool = b.amount + (b.carryOver || 0);
      const p = pool ? spent / pool : 0;
      return { ...b, pool, spent, tx, p, pace, expected: pool * pace, remaining: pool - spent, status: statusOf(p, spent) };
    });
    const totalIncome = sum(income), totalSpent = sum(expenses);
    const totalSavings = sum(savingsC), totalFunds = sum(fundC);
    return {
      income, expenses, rows, pace,
      totalIncome, totalSpent, totalSavings, totalFunds,
      totalBudget: sum(rows, "pool"),
      unspentInBudgets: rows.filter((r) => r.remaining > 0).reduce((t, r) => t + r.remaining, 0),
      available: totalIncome - totalSpent - totalSavings - totalFunds,
    };
  }, [data, key]);
}

const goalSaved = (g) => g.opening + sum(g.contributions) + sum(g.transfersIn) - sum(g.withdrawals);
const fundIn = (f) => f.opening + sum(f.contributions) + sum(f.transfersIn);
const fundOut = (f) => sum(f.project);

function personStats(data, key, pid) {
  const income = sum(data.income.filter((x) => x.month === key && x.profile === pid));
  const ex = data.expenses.filter((x) => x.month === key && x.paidBy === pid);
  const personal = sum(ex.filter((x) => !x.shared));
  const shared = sum(ex.filter((x) => x.shared));
  const savings = sum(data.goals.flatMap((g) => g.contributions).filter((c) => c.month === key && c.profile === pid));
  const funds = sum(data.funds.flatMap((f) => f.contributions).filter((c) => c.month === key && c.profile === pid));
  return { income, personal, shared, savings, funds, remaining: income - personal - shared - savings - funds };
}

function feed(data, key) {
  const r = [];
  data.income.filter((x) => x.month === key).forEach((x) =>
    r.push({ k: "income", date: x.date, title: x.source, sub: who(x.profile).name + (x.recurring ? " · recurring" : ""), amt: x.amount, glyph: "wallet" }));
  data.expenses.filter((x) => x.month === key).forEach((x) => {
    const b = data.budgets.find((y) => y.id === x.budget);
    r.push({ k: "expense", date: x.date, title: x.name, sub: (b ? b.name : "Uncategorised") + " · " + who(x.paidBy).name, amt: -x.amount, person: x.paidBy });
  });
  data.goals.forEach((g) => g.contributions.filter((c) => c.month === key).forEach((c) =>
    r.push({ k: "savings", date: c.date, title: g.name, sub: "Savings contribution · " + who(c.profile).name, amt: -c.amount, glyph: "goals" })));
  data.funds.forEach((f) => f.contributions.filter((c) => c.month === key).forEach((c) =>
    r.push({ k: "fund", date: c.date, title: f.name, sub: "Long-term contribution · " + who(c.profile).name, amt: -c.amount, glyph: "vault" })));
  data.transfers.filter((x) => x.month === key).forEach((x) =>
    r.push({ k: "transfer", date: x.date, title: x.to, sub: "From " + x.from, amt: x.amount, glyph: "swap", neutral: true }));
  return r.sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));
}

/* ----------------------------- UI primitives ------------------------------ */

function Meter({ parts }) {
  const total = parts.reduce((t, p) => t + Math.max(0, p.v), 0) || 1;
  return (
    <div className="kbn-meter" role="img" aria-label={parts.map((p) => p.l + " " + peso(p.v)).join(", ")}>
      {parts.map((p) => <span key={p.l} style={{ width: (Math.max(0, p.v) / total) * 100 + "%", background: p.c }} />)}
    </div>
  );
}

function Legend({ parts, total }) {
  return (
    <div className="kbn-legend">
      {parts.map((p) => (
        <div className="kbn-leg" key={p.l}>
          <div className="kbn-legtop"><span className="kbn-sw" style={{ background: p.c }} /><span className="kbn-legname">{p.l}</span></div>
          <div className="kbn-n kbn-legval">{peso(p.v)}<span className="kbn-legpct">{total ? pct(p.v / total) : "0%"}</span></div>
        </div>
      ))}
    </div>
  );
}

function Track({ p, pace, color = "var(--d1)", h = 6 }) {
  return (
    <div className="kbn-track" style={{ height: h }}>
      <div className="kbn-clip">
        <span className="fill" style={{ width: Math.min(100, p * 100) + "%", background: p > 1 ? "var(--neg)" : color, display: "block", height: "100%" }} />
      </div>
      {pace > 0 && pace < 1 && <span className="pace" style={{ left: pace * 100 + "%" }} />}
    </div>
  );
}

function Ring({ p, size = 96, stroke = 7, color = "var(--d2)" }) {
  const r = size / 2 - stroke / 2 - 1, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--card-3)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, p))} />
    </svg>
  );
}

const Tag = ({ s }) => <span className="kbn-tag" style={{ background: s.bg, color: s.fg }}>{s.t}</span>;

const Avatar = ({ id, size = 28 }) => (
  <span className="kbn-av" style={{ background: who(id).c, width: size, height: size, fontSize: size < 26 ? 9.5 : 11 }}>{who(id).i}</span>
);

const Stack = ({ ids, size = 22 }) => (
  <span style={{ display: "inline-flex" }}>
    {ids.map((id, n) => (
      <span key={id} style={{
        width: size, height: size, borderRadius: 6, background: who(id).c, color: "#fff",
        fontSize: 9, fontWeight: 600, display: "grid", placeItems: "center", fontFamily: "var(--disp)",
        marginLeft: n ? -6 : 0, border: "1.5px solid var(--card)",
      }}>{who(id).i}</span>
    ))}
  </span>
);

function Sheet({ title, onClose, children, foot }) {
  return (
    <>
      <div className="kbn-scrim" onClick={onClose} />
      <div className="kbn-sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="kbn-grab" />
        <div className="kbn-sheethead">
          <div className="kbn-sheettitle">{title}</div>
          <button className="kbn-iconbtn" onClick={onClose} aria-label="Close"><Ic n="x" s={17} /></button>
        </div>
        <div className="kbn-sheetbody">{children}</div>
        {foot && <div className="kbn-sheetfoot">{foot}</div>}
      </div>
    </>
  );
}

const Field = ({ label, hint, children }) => (
  <div className="kbn-field">
    <label className="kbn-label">{label}</label>
    {children}
    {hint && <div className="kbn-m" style={{ marginTop: 5 }}>{hint}</div>}
  </div>
);

const Money = ({ value, onChange, autoFocus }) => (
  <div className="kbn-money">
    <span>₱</span>
    <input inputMode="numeric" autoFocus={autoFocus} value={value} placeholder="0"
      onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))} />
  </div>
);

const Segmented = ({ value, onChange, options }) => (
  <div className="kbn-seg" role="tablist">
    {options.map((o) => (
      <button key={o.v} role="tab" aria-selected={value === o.v} className="kbn-segb" data-on={value === o.v ? 1 : 0} onClick={() => onChange(o.v)}>{o.l}</button>
    ))}
  </div>
);

const Empty = ({ title, body, action, onAction }) => (
  <div className="kbn-empty">
    <div className="kbn-t">{title}</div>
    <div className="kbn-s" style={{ maxWidth: 280, margin: "0 auto" }}>{body}</div>
    {action && <button className="kbn-act" onClick={onAction}>{action} <Ic n="arrow" s={13} /></button>}
  </div>
);

const Notice = ({ tone = "", icon = "alert", title, body, action, onAction }) => (
  <div className={"kbn-notice " + tone}>
    <Ic n={icon} s={17} style={{ flex: "0 0 auto", marginTop: 1, color: tone === "neg" ? "var(--neg)" : tone === "warn" ? "var(--warn)" : "var(--brand-2)" }} />
    <div style={{ flex: 1, minWidth: 0 }}>
      {title && <div className="kbn-t" style={{ fontSize: 13 }}>{title}</div>}
      <div className="kbn-s">{body}</div>
      {action && <button className="kbn-act" onClick={onAction}>{action} <Ic n="arrow" s={13} /></button>}
    </div>
  </div>
);

/* ================================== APP ================================== */

function Kaban({ boot, onWipe }) {
  const [data, setData] = useState(boot);
  const [mi, setMi] = useState(() => boot.months.length - 1);
  PEOPLE = data.people;
  const [tab, setTab] = useState("overview");
  const [sub, setSub] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [goalTab, setGoalTab] = useState("savings");

  const idx = Math.min(mi, data.months.length - 1);
  const month = data.months[idx];
  const key = month.key;
  const m = useMonth(data, key);
  const locked = month.closed;

  useEffect(() => { writeLocal(data); SB.push(data); }, [data]);

  const say = (msg, prev) => {
    const t = { msg, prev, id: Date.now() };
    setToast(t);
    setTimeout(() => setToast((c) => (c && c.id === t.id ? null : c)), 5000);
  };

  /* ------------------------------ actions -------------------------------- */

  const A = {
    open: (s) => setSheet(s),
    close: () => setSheet(null),
    goto: (t) => { setTab(t); setSub(null); },
    subgoto: (s) => setSub(s),
    setMonth: (i) => { setMi(i); setSheet(null); },

    addExpense(x) {
      if (locked) return;
      const prev = data;
      const b = data.budgets.find((y) => y.id === x.budget);
      const before = sum(data.expenses.filter((e) => e.budget === x.budget));
      const pool = b.amount + (b.carryOver || 0);
      setData((d) => ({ ...d, expenses: [...d.expenses, { ...x, id: uid("e"), month: key }] }));
      if (before + x.amount > pool) setSheet({ type: "over", budget: b, excess: before + x.amount - pool });
      else { setSheet(null); say(peso(x.amount) + " recorded in " + b.name + ", paid by " + who(x.paidBy).name + ".", prev); }
    },
    updateExpense(id, x) {
      if (locked) return;
      const current = data.expenses.find((e) => e.id === id && e.month === key);
      const b = data.budgets.find((y) => y.id === x.budget && y.month === key);
      if (!current || !b) return;
      const prev = data;
      const before = sum(data.expenses.filter((e) => e.budget === x.budget && e.id !== id));
      const pool = b.amount + (b.carryOver || 0);
      setData((d) => ({ ...d, expenses: d.expenses.map((e) => e.id === id ? { ...e, ...x, id, month: key } : e) }));
      if (before + x.amount > pool) setSheet({ type: "over", budget: b, excess: before + x.amount - pool });
      else { setSheet(null); say(peso(x.amount) + " purchase updated in " + b.name + ".", prev); }
    },
    deleteExpense(id) {
      if (locked) return;
      const current = data.expenses.find((e) => e.id === id && e.month === key);
      if (!current) return;
      const prev = data;
      setData((d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== id) }));
      setSheet(null);
      say(current.name + " deleted.", prev);
    },
    addIncome(x) {
      const prev = data;
      setData((d) => ({ ...d, income: [...d.income, { ...x, id: uid("i"), month: key }] }));
      setSheet(null); say(peso(x.amount) + " income recorded for " + who(x.profile).name + ".", prev);
    },
    addContribution(kind, id, profile, amount, date) {
      const prev = data;
      const name = (data[kind].find((g) => g.id === id) || {}).name;
      setData((d) => ({ ...d, [kind]: d[kind].map((g) => g.id === id
        ? { ...g, contributions: [...g.contributions, { month: key, profile, amount, date }] } : g) }));
      setSheet(null); say(peso(amount) + " moved into " + name + ". Set aside, not spent.", prev);
    },
    addBudget(name, amount, funding, forChild) {
      const prev = data;
      setData((d) => ({ ...d, budgets: [...d.budgets, { id: uid("b"), month: key, name, amount, funding, forChild: !!forChild }] }));
      setSheet(null); say(name + " created with a " + peso(amount) + " limit. Nothing counted as spent yet.", prev);
    },
    transfer(from, to, amount, msg) {
      const prev = data;
      setData((d) => ({ ...d, transfers: [...d.transfers, { id: uid("t"), month: key, date: TODAY, from, to, amount }] }));
      setSheet(null); say(msg || peso(amount) + " moved. Logged as a transfer, not an expense.", prev);
    },
    closeMonth(plan) {
      const prev = data;
      const nk = nextKey(key);
      setData((d) => {
        const goals = d.goals.map((g) => ({ ...g }));
        const funds = d.funds.map((f) => ({ ...f }));
        const transfers = [...d.transfers];
        const carry = {};
        const created = [];
        const label = (r) => r.name + " budget, " + monthShort(key);

        const apply = (r, dest, amount, newName) => {
          if (!(amount > 0)) return;
          if (dest === "carry") {
            carry[r.name] = (carry[r.name] || 0) + amount;
            transfers.push({ id: uid("t"), month: nk, date: nk + "-01", from: label(r), to: r.name + " budget, " + monthShort(nk), amount });
            return;
          }
          if (dest === "return") {
            transfers.push({ id: uid("t"), month: nk, date: nk + "-01", from: label(r), to: "Household available balance", amount });
            return;
          }
          if (dest === "new") {
            const g = { id: uid("g"), name: (newName || "").trim() || "New savings card", target: Math.max(10000, amount * 10),
              opening: 0, targetDate: "Not set", forChild: false, contributions: [],
              transfersIn: [{ month: nk, from: label(r), amount, date: nk + "-01" }], withdrawals: [] };
            created.push(g);
            transfers.push({ id: uid("t"), month: nk, date: nk + "-01", from: label(r), to: g.name, amount });
            return;
          }
          const [kind, id] = dest.split(":");
          const t = (kind === "g" ? goals : funds).find((x) => x.id === id);
          if (t) {
            t.transfersIn = [...t.transfersIn, { month: nk, from: label(r), amount, date: nk + "-01" }];
            transfers.push({ id: uid("t"), month: nk, date: nk + "-01", from: label(r), to: t.name, amount });
          }
        };

        plan.rows.forEach((r) => {
          if (r.split) { apply(r, r.dest, r.a1, r.newName); apply(r, r.dest2, r.remaining - r.a1, r.newName); }
          else apply(r, r.dest, r.remaining, r.newName);
        });
        plan.over.forEach((r) => transfers.push({
          id: uid("t"), month: nk, date: nk + "-01", from: r.source, to: r.name + " budget, " + monthShort(key), amount: r.excess,
        }));

        const cloned = d.budgets.filter((b) => b.month === key).map((b) => ({ ...b, id: uid("b"), month: nk, carryOver: carry[b.name] || 0 }));
        return {
          ...d,
          months: [...d.months.map((x) => (x.key === key ? { ...x, closed: true } : x)), { key: nk, closed: false }],
          budgets: [...d.budgets, ...cloned],
          goals: [...goals, ...created], funds, transfers,
        };
      });
      setSheet(null);
      setMi(idx + 1);
      setTab("overview");
      say(monthLong(key) + " closed. Balances moved as transfers, not expenses.", prev);
    },
    reopen() {
      const prev = data;
      setData((d) => ({ ...d, months: d.months.map((x) => (x.key === key ? { ...x, closed: false } : x)) }));
      say(monthLong(key) + " reopened. Records can be edited again.", prev);
    },
    setHousehold(v) { setData((d) => ({ ...d, household: v })); },
    addPerson(name, kind) {
      const prev = data;
      setData((d) => {
        const rest = d.people.filter((p) => p.kind !== "shared");
        const shared = d.people.filter((p) => p.kind === "shared");
        return { ...d, people: [...rest, {
          id: uid("p"), name, role: kind === "child" ? "Child" : "Adult", kind,
          c: PALETTE[rest.length % PALETTE.length], i: initialsOf(name),
        }, ...shared] };
      });
      say(name + " added to the household.", prev);
    },
    removePerson(id) {
      const prev = data;
      setData((d) => ({ ...d, people: d.people.filter((p) => p.id !== id) }));
      say("Member removed. Their past records stay in the history.", prev);
    },
    addGoalOrFund(bucket, base) {
      const prev = data;
      const rec = bucket === "goals"
        ? { id: uid("g"), name: base.name, target: base.target, opening: 0, targetDate: base.targetDate,
            forChild: !!base.forChild, contributions: [], transfersIn: [], withdrawals: [] }
        : { id: uid("f"), name: base.name, target: base.target, opening: 0, targetDate: base.targetDate,
            contributions: [], transfersIn: [], project: [] };
      setData((d) => ({ ...d, [bucket]: [...d[bucket], rec] }));
      setSheet(null); say(base.name + " created.", prev);
    },
    addMonth() {
      const prev = data;
      const nk = nextKey(data.months[data.months.length - 1].key);
      setData((d) => ({ ...d, months: [...d.months, { key: nk, closed: false }] }));
      setMi(data.months.length); setSheet(null); setTab("overview");
      say(monthLong(nk) + " started.", prev);
    },
    replaceAll(next) { setData(next); setSheet(null); say("Backup restored."); },
    wipe() { if (onWipe) onWipe(); },
    undo(prev) { setData(prev); setToast(null); say("Change undone."); },
  };

  const ctx = { data, m, key, month, locked, idx, A, sheet, setSheet, filter, setFilter, query, setQuery, goalTab, setGoalTab, sub, setSub, tab };

  const view = sub || tab;
  const TITLES = { overview: "Overview", budgets: "Budgets", goals: "Goals", activity: "Activity", more: "More", people: "Profiles", reports: "Reports" };

  return (
    <div className="kbn">
      <style>{CSS}</style>
      <div className="kbn-stage">

        <div className="kbn-lockup">
          <div className="kbn-mark" aria-hidden="true" />
          <div className="kbn-word">Kaban</div>
          <div className="kbn-rule" />
          <div className="kbn-claim">Household money, in one place</div>
        </div>

        <div className="kbn-device">
          <header className="kbn-bar">
            <div style={{ minWidth: 0 }}>
              <div className="kbn-bartitle">{TITLES[view]}</div>
              <div className="kbn-barsub">
                {locked ? <><Ic n="lock" s={11} /> Closed, read only</> : (data.household || "Household") + " · " + PEOPLE.filter((p) => p.kind !== "shared").length + " members"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button className="kbn-iconbtn" disabled={idx === 0} onClick={() => setMi(idx - 1)} aria-label="Previous month"><Ic n="left" s={15} /></button>
              <button className="kbn-monthbtn" onClick={() => setSheet({ type: "months" })}>
                {monthShort(key)} {key.slice(0, 4)} <Ic n="down" s={13} />
              </button>
              <button className="kbn-iconbtn" disabled={idx === data.months.length - 1} onClick={() => setMi(idx + 1)} aria-label="Next month"><Ic n="right" s={15} /></button>
            </div>
          </header>

          <main className="kbn-scroll">
            {view === "overview" && <Overview ctx={ctx} />}
            {view === "budgets" && <Budgets ctx={ctx} />}
            {view === "goals" && <Goals ctx={ctx} />}
            {view === "activity" && <Activity ctx={ctx} />}
            {view === "more" && <More ctx={ctx} />}
            {view === "people" && <Profiles ctx={ctx} />}
            {view === "reports" && <Reports ctx={ctx} />}
          </main>

          <button className="kbn-fab" disabled={locked} onClick={() => setSheet({ type: "add" })}>
            <Ic n="plus" s={17} w={2} /> Add
          </button>

          <nav className="kbn-tabs" role="tablist">
            {[["overview", "Overview"], ["budgets", "Budgets"], ["goals", "Goals"], ["activity", "Activity"], ["more", "More"]].map(([id, label]) => (
              <button key={id} role="tab" aria-selected={tab === id} className="kbn-tab" data-on={tab === id ? 1 : 0} onClick={() => A.goto(id)}>
                <Ic n={id} s={19} w={tab === id ? 1.9 : 1.6} /><span>{label}</span>
              </button>
            ))}
          </nav>

          {toast && (
            <div className="kbn-toast" role="status">
              <Ic n="check" s={16} style={{ flex: "0 0 auto" }} />
              <span>{toast.msg}</span>
              {toast.prev ? <button onClick={() => A.undo(toast.prev)}>UNDO</button> : <button onClick={() => setToast(null)}>OK</button>}
            </div>
          )}

          {sheet && <SheetRouter ctx={ctx} />}
        </div>

        <p className="kbn-note">
          Interactive prototype · sample data for July 2026. Try <b>Add</b> an expense that breaks a limit,
          open a budget to see the <b>pace marker</b>, or run <b>Close the month</b> from Overview.
        </p>
      </div>
    </div>
  );
}

/* ================================ SCREENS ================================ */

function Overview({ ctx }) {
  const { data, m, key, locked, idx, A, setSheet } = ctx;
  const parts = [
    { l: "Spent", v: m.totalSpent, c: "var(--d1)" },
    { l: "Saved", v: m.totalSavings, c: "var(--d2)" },
    { l: "Long-term", v: m.totalFunds, c: "var(--d3)" },
    { l: "Available", v: Math.max(0, m.available), c: "var(--d4)" },
  ];
  const alerts = m.rows.filter((b) => b.p >= 0.75).sort((a, b) => b.p - a.p).slice(0, 2);
  const closable = !locked && m.rows.length > 0 && idx === data.months.length - 1 && m.pace > 0 && m.pace < 1;
  const prevKey = idx > 0 ? data.months[idx - 1].key : null;
  const expected = prevKey ? sum(data.income.filter((x) => x.month === prevKey && x.recurring)) : 0;
  const top = [...m.rows].sort((a, b) => b.p - a.p).slice(0, 4);

  return (
    <>
      <section className="kbn-card kbn-pad">
        <div className="kbn-eyebrow">Available balance</div>
        <div className="kbn-n" style={{ fontSize: 34, marginTop: 3, lineHeight: 1.1 }}>{peso(m.available)}</div>
        <div className="kbn-m" style={{ marginTop: 3 }}>
          of {peso(m.totalIncome)} that came in during {monthLong(key)}
        </div>
        <div style={{ marginTop: 16 }}><Meter parts={parts} /></div>
        <Legend parts={parts} total={m.totalIncome} />
        <button className="kbn-act" onClick={() => setSheet({ type: "formula" })}>How this is worked out <Ic n="arrow" s={13} /></button>
      </section>

      {m.income.length === 0 && expected > 0 && (
        <div style={{ marginTop: 14 }}>
          <Notice tone="info" icon="calendar" title="Recurring income scheduled"
            body={`${peso(expected)} is expected this month from 2 recurring sources. Nothing has been received yet.`} />
        </div>
      )}

      {closable && (
        <div style={{ marginTop: 14 }}>
          <Notice tone="info" icon="calendar" title={`${daysIn(key) - Number(TODAY.slice(8, 10))} days left in ${monthShort(key)}`}
            body={`${peso(m.unspentInBudgets)} is still sitting unspent in budgets. Decide where it goes before the month rolls over.`}
            action="Review and close the month" onAction={() => setSheet({ type: "review" })} />
        </div>
      )}

      {alerts.length > 0 && (
        <section className="kbn-sec">
          <div className="kbn-sechead"><div className="kbn-eyebrow">Needs a decision</div></div>
          <div style={{ display: "grid", gap: 9 }}>
            {alerts.map((b) => (
              <Notice key={b.id} tone={b.p > 1 ? "neg" : "warn"}
                title={b.p > 1 ? `${b.name} is ${peso(-b.remaining)} over` : `${b.name} is ${pct(b.p)} used`}
                body={`${peso(b.spent)} spent of ${peso(b.pool)}${b.p <= 1 ? `, ${peso(b.remaining)} left` : ""}.`}
                action="Open budget" onAction={() => setSheet({ type: "budget", id: b.id })} />
            ))}
          </div>
        </section>
      )}

      <section className="kbn-sec">
        <div className="kbn-sechead">
          <div className="kbn-eyebrow">Budgets</div>
          <button className="kbn-more" onClick={() => A.goto("budgets")}>All {m.rows.length} <Ic n="right" s={12} /></button>
        </div>
        {m.rows.length === 0 ? (
          <div className="kbn-card"><Empty title="No budgets set for this month"
            body="A budget is a limit, not a payment. Setting one does not move any money."
            action="Create a budget" onAction={() => setSheet({ type: "add", pick: "budget" })} /></div>
        ) : (
          <div className="kbn-list">
            {top.map((b) => (
              <button className="kbn-row" key={b.id} onClick={() => setSheet({ type: "budget", id: b.id })}>
                <div className="kbn-rowmain">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                    <span className="kbn-t">{b.name}</span><Tag s={b.status} />
                  </div>
                  <Track p={b.p} pace={b.pace} />
                </div>
                <div className="kbn-rowend" style={{ width: 92 }}>
                  <div className="kbn-n" style={{ fontSize: 14 }}>{peso(b.remaining)}</div>
                  <div className="kbn-m">left of {pesoK(b.pool)}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="kbn-sec">
        <div className="kbn-sechead">
          <div className="kbn-eyebrow">Members</div>
          <button className="kbn-more" onClick={() => A.subgoto("people")}>Profiles <Ic n="right" s={12} /></button>
        </div>
        <div className="kbn-list">
          {PEOPLE.filter((p) => p.kind !== "shared").map((p) => {
            const s = personStats(data, key, p.id);
            const kid = p.kind === "child";
            const saved = sum(data.goals.filter((g) => g.forChild).map(goalSaved), null);
            const spentOn = sum(m.rows.filter((r) => r.forChild).map((r) => r.spent), null);
            return (
              <button className="kbn-row" key={p.id} onClick={() => A.subgoto("people")}>
                <Avatar id={p.id} />
                <div className="kbn-rowmain">
                  <div className="kbn-t">{p.name}</div>
                  <div className="kbn-m">{kid ? `${peso(saved)} saved for Ana` : `Earned ${peso(s.income)} · used ${peso(s.personal + s.shared + s.savings + s.funds)}`}</div>
                </div>
                <div className="kbn-rowend">
                  <div className="kbn-n" style={{ fontSize: 14 }}>{kid ? peso(spentOn) : peso(s.remaining)}</div>
                  <div className="kbn-m">{kid ? "spent this month" : "left"}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="kbn-sec">
        <div className="kbn-sechead">
          <div className="kbn-eyebrow">Recent activity</div>
          <button className="kbn-more" onClick={() => A.goto("activity")}>See all <Ic n="right" s={12} /></button>
        </div>
        <div className="kbn-list">
          {feed(data, key).slice(0, 5).map((r, i) => <FeedRow key={i} r={r} />)}
        </div>
      </section>
    </>
  );
}

function Budgets({ ctx }) {
  const { m, setSheet, locked } = ctx;
  if (m.rows.length === 0) return (
    <div className="kbn-card"><Empty title="No budgets yet this month"
      body="Set a limit for a category. Money only leaves when you record a purchase against it."
      action="Create a budget" onAction={() => setSheet({ type: "add", pick: "budget" })} /></div>
  );
  const p = m.totalBudget ? m.totalSpent / m.totalBudget : 0;
  const expected = m.totalBudget * m.pace;
  const diff = m.totalSpent - expected;

  return (
    <>
      <section className="kbn-card kbn-pad">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 13 }}>
          <div>
            <div className="kbn-eyebrow">Spent across all budgets</div>
            <div className="kbn-n" style={{ fontSize: 26, marginTop: 3 }}>{peso(m.totalSpent)}</div>
            <div className="kbn-m">of {peso(m.totalBudget)} set aside</div>
          </div>
          <div className="kbn-rowend">
            <div className="kbn-n" style={{ fontSize: 17 }}>{pct(p)}</div>
            <div className="kbn-m">used</div>
          </div>
        </div>
        <Track p={p} pace={m.pace} h={8} />
        {m.pace > 0 && m.pace < 1 && (
          <div className="kbn-m" style={{ marginTop: 9, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 1.5, height: 11, background: "var(--ink-3)", display: "inline-block", borderRadius: 2 }} />
            Day {TODAY.slice(8, 10)} of {daysIn(ctx.key)} · {diff <= 0
              ? <b style={{ color: "var(--pos)", fontWeight: 600 }}>{peso(-diff)} under the even pace</b>
              : <b style={{ color: "var(--warn)", fontWeight: 600 }}>{peso(diff)} ahead of the even pace</b>}
          </div>
        )}
      </section>

      <section className="kbn-sec">
        <div className="kbn-sechead">
          <div className="kbn-eyebrow">{m.rows.length} budgets</div>
          {!locked && <button className="kbn-more" onClick={() => setSheet({ type: "add", pick: "budget" })}>New <Ic n="plus" s={12} /></button>}
        </div>
        <div className="kbn-list">
          {m.rows.map((b) => (
            <button className="kbn-row" key={b.id} onClick={() => setSheet({ type: "budget", id: b.id })} style={{ alignItems: "flex-start" }}>
              <div className="kbn-rowmain">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
                  <span className="kbn-t">{b.name}</span>
                  <span className="kbn-n" style={{ fontSize: 14 }}>{peso(b.spent)} <span style={{ color: "var(--ink-4)", fontWeight: 500 }}>/ {peso(b.pool)}</span></span>
                </div>
                <div style={{ margin: "8px 0 8px" }}><Track p={b.p} pace={b.pace} /></div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <Stack ids={b.funding.map((f) => f.profile)} size={20} />
                    <span className="kbn-m">{b.tx.length} {b.tx.length === 1 ? "purchase" : "purchases"}{b.carryOver ? ` · +${peso(b.carryOver)} carried` : ""}</span>
                  </span>
                  <Tag s={b.status} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function Goals({ ctx }) {
  const { data, m, key, goalTab, setGoalTab, setSheet, locked } = ctx;
  const savingsTotal = sum(data.goals.map(goalSaved), null);
  const fundsTotal = data.funds.reduce((t, f) => t + fundIn(f) - fundOut(f), 0);

  return (
    <>
      <Segmented value={goalTab} onChange={setGoalTab}
        options={[{ v: "savings", l: "Savings" }, { v: "long", l: "Long-term funds" }]} />

      {goalTab === "savings" ? (
        <>
          <section className="kbn-card kbn-pad" style={{ marginTop: 14 }}>
            <div className="kbn-eyebrow">Total saved</div>
            <div className="kbn-n" style={{ fontSize: 28, marginTop: 3 }}>{peso(savingsTotal)}</div>
            <div className="kbn-m">{peso(m.totalSavings)} added in {monthShort(key)} across {data.goals.length} cards</div>
          </section>
          {data.goals.length === 0 ? (
            <div className="kbn-card" style={{ marginTop: 14 }}><Empty title="No savings cards yet"
              body="A savings card is a named pot with a target. Money in it is set aside, never counted as spent."
              action="Create a savings card" onAction={() => setSheet({ type: "newgoal" })} /></div>
          ) : (
          <div className="kbn-list" style={{ marginTop: 14 }}>
            {data.goals.map((g) => {
              const s = goalSaved(g), p = s / g.target;
              return (
                <button className="kbn-row" key={g.id} onClick={() => setSheet({ type: "goal", id: g.id })} style={{ alignItems: "flex-start" }}>
                  <div className="kbn-rowmain">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
                      <span className="kbn-t">{g.name}</span>
                      <span className="kbn-n" style={{ fontSize: 14 }}>{pct(p)}</span>
                    </div>
                    <div style={{ margin: "8px 0" }}><Track p={p} color="var(--d2)" /></div>
                    <div className="kbn-m">{peso(s)} of {pesoK(g.target)} · {peso(g.target - s)} to go · target {g.targetDate}</div>
                  </div>
                </button>
              );
            })}
          </div>
          )}
          {!locked && (
            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              {data.goals.length > 0 && (
                <button className="kbn-btn" onClick={() => setSheet({ type: "add", pick: "savings" })}>
                  <Ic n="plus" s={16} /> Add a contribution
                </button>
              )}
              <button className="kbn-btn ghost" onClick={() => setSheet({ type: "newgoal" })}>New savings card</button>
            </div>
          )}
        </>
      ) : (
        <>
          <section className="kbn-card kbn-pad" style={{ marginTop: 14 }}>
            <div className="kbn-eyebrow">Held in long-term funds</div>
            <div className="kbn-n" style={{ fontSize: 28, marginTop: 3 }}>{peso(fundsTotal)}</div>
            <div className="kbn-m">Contributions are not expenses. Only project spending is.</div>
          </section>
          {data.funds.length === 0 ? (
            <div className="kbn-card" style={{ marginTop: 14 }}><Empty title="No long-term funds yet"
              body="A fund gathers money for one big project, like a franchise, a house, or a vehicle."
              action="Create a fund" onAction={() => setSheet({ type: "newfund" })} /></div>
          ) : (
          <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
            {data.funds.map((f) => {
              const inn = fundIn(f), out = fundOut(f);
              return (
                <button className="kbn-card kbn-pad" key={f.id} style={{ textAlign: "left" }} onClick={() => setSheet({ type: "fund", id: f.id })}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div><div className="kbn-t">{f.name}</div><div className="kbn-m">Target {pesoK(f.target)} by {f.targetDate}</div></div>
                    <Ic n="right" s={16} style={{ color: "var(--ink-4)", marginTop: 3 }} />
                  </div>
                  <Meter parts={[
                    { l: "Spent", v: out, c: "var(--d1)" },
                    { l: "In fund", v: inn - out, c: "var(--d3)" },
                    { l: "Still needed", v: Math.max(0, f.target - inn), c: "var(--d4)" },
                  ]} />
                  <div className="kbn-3" style={{ marginTop: 13 }}>
                    {[["In the fund", inn - out], ["Spent", out], ["Still needed", Math.max(0, f.target - inn)]].map(([l, v]) => (
                      <div key={l}><div className="kbn-eyebrow" style={{ fontSize: 9.5 }}>{l}</div><div className="kbn-n" style={{ fontSize: 14, marginTop: 2 }}>{pesoK(v)}</div></div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
          )}
          {!locked && (
            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              {data.funds.length > 0 && (
                <button className="kbn-btn" onClick={() => setSheet({ type: "add", pick: "fund" })}>
                  <Ic n="plus" s={16} /> Add a contribution
                </button>
              )}
              <button className="kbn-btn ghost" onClick={() => setSheet({ type: "newfund" })}>New long-term fund</button>
            </div>
          )}
        </>
      )}
    </>
  );
}

function Activity({ ctx }) {
  const { data, key, filter, setFilter, query, setQuery } = ctx;
  const all = feed(data, key);
  const rows = all.filter((r) => (filter === "all" || r.k === filter))
    .filter((r) => !query.trim() || (r.title + " " + r.sub).toLowerCase().includes(query.trim().toLowerCase()));
  const groups = [];
  rows.forEach((r) => {
    const g = groups.find((x) => x.date === r.date);
    if (g) g.rows.push(r); else groups.push({ date: r.date, rows: [r] });
  });
  const kinds = [["all", "All"], ["expense", "Expenses"], ["income", "Income"], ["savings", "Savings"], ["fund", "Long-term"], ["transfer", "Transfers"]];

  return (
    <>
      <div className="kbn-search">
        <Ic n="search" s={15} style={{ color: "var(--ink-4)" }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by item, category, or person" aria-label="Search activity" />
        {query && <button onClick={() => setQuery("")} aria-label="Clear search"><Ic n="x" s={14} style={{ color: "var(--ink-3)" }} /></button>}
      </div>
      <div className="kbn-chips" style={{ marginTop: 10 }}>
        {kinds.map(([id, label]) => (
          <button key={id} className="kbn-chip" data-on={filter === id ? 1 : 0} onClick={() => setFilter(id)}>{label}</button>
        ))}
      </div>

      {filter === "transfer" && (
        <div style={{ marginTop: 12 }}>
          <Notice icon="swap" body="Transfers move money between budgets, savings, and balances. They never change the month's expense total." />
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        {groups.length === 0 ? (
          <div className="kbn-card"><Empty title="Nothing matches" body="Try a different search term or clear the filters above." /></div>
        ) : groups.map((g) => {
          const net = g.rows.filter((r) => !r.neutral).reduce((t, r) => t + r.amt, 0);
          return (
            <div className="kbn-list" key={g.date} style={{ marginBottom: 12 }}>
              <div className="kbn-daybar">
                <span className="kbn-eyebrow">{dayLong(g.date)}</span>
                <span className="kbn-n" style={{ fontSize: 12, color: net >= 0 ? "var(--pos)" : "var(--ink-2)" }}>
                  {net >= 0 ? "+" : ""}{peso(net)}
                </span>
              </div>
              {g.rows.map((r, i) => <FeedRow key={i} r={r} hideDate />)}
            </div>
          );
        })}
      </div>
    </>
  );
}

function FeedRow({ r, hideDate }) {
  return (
    <div className="kbn-row">
      {r.person ? <Avatar id={r.person} /> : <span className="kbn-glyph"><Ic n={r.glyph || "wallet"} s={15} /></span>}
      <div className="kbn-rowmain">
        <div className="kbn-t" style={{ fontWeight: 500 }}>{r.title}</div>
        <div className="kbn-m">{r.sub}</div>
      </div>
      <div className="kbn-rowend">
        <div className="kbn-n" style={{ fontSize: 13.5, color: r.neutral ? "var(--ink-3)" : r.amt > 0 ? "var(--pos)" : "var(--ink)" }}>
          {r.neutral ? peso(r.amt) : (r.amt > 0 ? "+" : "−") + peso(Math.abs(r.amt))}
        </div>
        {!hideDate && <div className="kbn-m">{dayShort(r.date)}</div>}
      </div>
    </div>
  );
}

function Profiles({ ctx }) {
  const { data, key, m } = ctx;
  return (
    <>
      <Notice icon="shield" body="Purchases marked shared roll up to the household. Personal ones stay on that member's card only." />
      <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
        {PEOPLE.map((p) => {
          const s = personStats(data, key, p.id);
          const saved = sum(data.goals.filter((g) => g.forChild).map(goalSaved), null);
          const spentOn = sum(m.rows.filter((r) => r.forChild).map((r) => r.spent), null);
          return (
            <section className="kbn-card kbn-pad" key={p.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
                <Avatar id={p.id} size={36} />
                <div style={{ flex: 1 }}>
                  <div className="kbn-t" style={{ fontSize: 15 }}>{p.name}</div>
                  <div className="kbn-m">{p.role}</div>
                </div>
                {p.admin && <span className="kbn-tag" style={{ background: "var(--brand-tint)", color: "var(--brand-2)" }}>Admin</span>}
              </div>

              {p.kind === "shared" ? (
                <div className="kbn-s">
                  Shared purchases this month total <b>{peso(sum(data.expenses.filter((e) => e.month === key && e.shared)))}</b> across {m.rows.length} budgets,
                  funded by both parents.
                </div>
              ) : p.kind === "child" ? (
                <div className="kbn-2">
                  <div><div className="kbn-eyebrow">Saved for Ana</div><div className="kbn-n" style={{ fontSize: 18, marginTop: 3 }}>{peso(saved)}</div></div>
                  <div><div className="kbn-eyebrow">Spent this month</div><div className="kbn-n" style={{ fontSize: 18, marginTop: 3 }}>{peso(spentOn)}</div></div>
                </div>
              ) : (
                <>
                  <Meter parts={[
                    { l: "Shared", v: s.shared, c: "var(--d1)" },
                    { l: "Personal", v: s.personal, c: "var(--d2)" },
                    { l: "Set aside", v: s.savings + s.funds, c: "var(--d3)" },
                    { l: "Left", v: Math.max(0, s.remaining), c: "var(--d4)" },
                  ]} />
                  <div style={{ marginTop: 12 }}>
                    {[["Income", s.income], ["Share of household expenses", -s.shared], ["Personal expenses", -s.personal],
                      ["Savings contributions", -s.savings], ["Long-term contributions", -s.funds]].map(([l, v]) => (
                      <div className="kbn-kv" key={l}><span>{l}</span><span className="kbn-n" style={{ fontSize: 13 }}>{peso(v)}</span></div>
                    ))}
                    <div className="kbn-kv" style={{ paddingTop: 11 }}>
                      <span style={{ fontWeight: 600, color: "var(--ink)", fontSize: 13.5 }}>Remaining balance</span>
                      <span className="kbn-n" style={{ fontSize: 16 }}>{peso(s.remaining)}</span>
                    </div>
                  </div>
                </>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}

function Reports({ ctx }) {
  const { data, m, key, idx } = ctx;
  const series = data.months.map((mm) => ({
    key: mm.key,
    income: sum(data.income.filter((x) => x.month === mm.key)),
    spent: sum(data.expenses.filter((x) => x.month === mm.key)),
  }));
  const peak = Math.max(1, ...series.map((s) => Math.max(s.income, s.spent)));
  const prev = idx > 0 ? series[idx - 1] : null;
  const delta = prev && prev.spent ? ((m.totalSpent - prev.spent) / prev.spent) * 100 : null;
  const byCat = m.rows.filter((r) => r.spent > 0).sort((a, b) => b.spent - a.spent);
  const ramp = ["var(--d1)", "#265A7D", "var(--d2)", "#5B8CAE", "var(--d3)", "#A8C4D6", "var(--d4)"];
  const byPerson = adults().map((p) => ({ ...p, v: sum(data.expenses.filter((e) => e.month === key && e.paidBy === p.id)) }));
  const pPeak = Math.max(1, ...byPerson.map((p) => p.v));
  const largest = [...m.expenses].sort((a, b) => b.amount - a.amount).slice(0, 4);
  if (m.totalIncome === 0 && m.totalSpent === 0) return (
    <div className="kbn-card"><Empty title="Nothing to report yet"
      body="Record some income and a few purchases and this fills in with trends, categories and comparisons." /></div>
  );

  return (
    <>
      <section className="kbn-card kbn-pad">
        <div className="kbn-sechead" style={{ marginBottom: 4 }}>
          <div className="kbn-eyebrow">Income against spending</div>
          {delta !== null && (
            <span className="kbn-n" style={{ fontSize: 12, color: delta > 0 ? "var(--warn)" : "var(--pos)" }}>
              {delta > 0 ? "+" : ""}{delta.toFixed(1)}% vs {monthShort(prev.key)}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-end", height: 128, marginTop: 14 }}>
          {series.map((s) => (
            <div key={s.key} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 100, justifyContent: "center" }}>
                <div style={{ width: 20, height: Math.max(2, (s.income / peak) * 100), background: "var(--d2)", borderRadius: "3px 3px 0 0" }} />
                <div style={{ width: 20, height: Math.max(2, (s.spent / peak) * 100), background: "var(--d1)", borderRadius: "3px 3px 0 0" }} />
              </div>
              <div className="kbn-m" style={{ marginTop: 8, fontWeight: s.key === key ? 600 : 400, color: s.key === key ? "var(--ink)" : undefined }}>
                {monthShort(s.key)}
              </div>
            </div>
          ))}
        </div>
        <div className="kbn-m" style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 6 }}>
          <span><span className="kbn-sw" style={{ background: "var(--d2)", display: "inline-block", marginRight: 5 }} />Income</span>
          <span><span className="kbn-sw" style={{ background: "var(--d1)", display: "inline-block", marginRight: 5 }} />Spent</span>
        </div>
      </section>

      <section className="kbn-sec">
        <div className="kbn-sechead"><div className="kbn-eyebrow">Where {monthShort(key)} went</div><span className="kbn-m">{peso(m.totalSpent)} total</span></div>
        <div className="kbn-card kbn-pad">
          {byCat.length === 0 ? <div className="kbn-s">No purchases recorded yet this month.</div> : byCat.map((c, i) => (
            <div key={c.id} style={{ marginBottom: i === byCat.length - 1 ? 0 : 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12.5 }}>
                <span>{c.name}</span>
                <span className="kbn-n" style={{ fontSize: 12.5 }}>{peso(c.spent)} <span style={{ color: "var(--ink-4)" }}>{pct(c.spent / m.totalSpent)}</span></span>
              </div>
              <Track p={c.spent / byCat[0].spent} color={ramp[Math.min(i, ramp.length - 1)]} h={7} />
            </div>
          ))}
        </div>
      </section>

      <section className="kbn-sec">
        <div className="kbn-sechead"><div className="kbn-eyebrow">Who paid</div></div>
        <div className="kbn-card kbn-pad">
          {byPerson.map((p, i) => (
            <div key={p.id} style={{ marginBottom: i === byPerson.length - 1 ? 0 : 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12.5 }}>
                <span>{p.name}</span><span className="kbn-n" style={{ fontSize: 12.5 }}>{peso(p.v)}</span>
              </div>
              <Track p={p.v / pPeak} color={p.c} h={7} />
            </div>
          ))}
        </div>
      </section>

      <section className="kbn-sec">
        <div className="kbn-sechead"><div className="kbn-eyebrow">Largest purchases</div></div>
        <div className="kbn-list">
          {largest.map((e) => (
            <div className="kbn-row" key={e.id}>
              <Avatar id={e.paidBy} />
              <div className="kbn-rowmain">
                <div className="kbn-t" style={{ fontWeight: 500 }}>{e.name}</div>
                <div className="kbn-m">{e.merchant} · {dayShort(e.date)}</div>
              </div>
              <div className="kbn-n" style={{ fontSize: 13.5 }}>{peso(e.amount)}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function More({ ctx }) {
  const { A, key, locked, setSheet, month } = ctx;
  const rows = [
    ["people", "Profiles", "Members, income, and what each has left", () => A.subgoto("people")],
    ["chart", "Reports", "Trends, categories, contributors, comparisons", () => A.subgoto("reports")],
    ["export", "Backup and settings", "Export, restore, members, cloud sync", () => setSheet({ type: "settings" })],
    ["calendar", "Recurring", "Salary, rent, bills, planned contributions", null],
    ["bell", "Reminders", "Overspending, due dates, contribution nudges", null],
    ["shield", "App lock", "PIN and biometric lock for this device", null],
  ];
  return (
    <>
      <div className="kbn-list">
        {rows.map(([icon, title, sub, fn]) => (
          <button className="kbn-row" key={title} onClick={fn || (() => {})} disabled={!fn} style={{ opacity: fn ? 1 : 0.55, cursor: fn ? "pointer" : "default" }}>
            <span className="kbn-glyph"><Ic n={icon} s={16} /></span>
            <div className="kbn-rowmain">
              <div className="kbn-t">{title}</div>
              <div className="kbn-m">{sub}</div>
            </div>
            {fn ? <Ic n="right" s={15} style={{ color: "var(--ink-4)" }} />
                : <span className="kbn-tag" style={{ background: "var(--card-3)", color: "var(--ink-3)" }}>Later</span>}
          </button>
        ))}
      </div>

      <section className="kbn-sec">
        <div className="kbn-sechead"><div className="kbn-eyebrow">This month</div></div>
        <div className="kbn-card kbn-pad">
          <div className="kbn-t">{monthLong(key)}</div>
          <div className="kbn-s" style={{ marginTop: 4 }}>
            {locked
              ? "Closed and read only. Past months stay available for review, and can be reopened if a record needs correcting."
              : "Open. Closing the month reviews every unused balance and starts the next one with your carry-overs applied."}
          </div>
          <button className={"kbn-btn" + (locked ? " ghost" : "")} style={{ marginTop: 13 }}
            onClick={() => (locked ? A.reopen() : setSheet({ type: "review" }))}>
            {locked ? "Reopen " + monthShort(key) : "Review and close " + monthShort(key)}
          </button>
        </div>
      </section>
    </>
  );
}

/* ================================= SHEETS ================================ */

function SheetRouter({ ctx }) {
  const s = ctx.sheet;
  if (!s) return null;
  switch (s.type) {
    case "budget": return <BudgetSheet ctx={ctx} s={s} />;
    case "goal": return <GoalSheet ctx={ctx} s={s} />;
    case "fund": return <FundSheet ctx={ctx} s={s} />;
    case "add": return <AddSheet ctx={ctx} s={s} />;
    case "over": return <OverSheet ctx={ctx} s={s} />;
    case "review": return <ReviewSheet ctx={ctx} />;
    case "months": return <MonthSheet ctx={ctx} />;
    case "formula": return <FormulaSheet ctx={ctx} />;
    case "settings": return <SettingsSheet ctx={ctx} />;
    case "newgoal": return <GoalForm ctx={ctx} kind="goal" />;
    case "newfund": return <GoalForm ctx={ctx} kind="fund" />;
    default: return null;
  }
}

function MonthSheet({ ctx }) {
  const { data, idx, A } = ctx;
  return (
    <Sheet title="Jump to a month" onClose={A.close}>
      <div className="kbn-list">
        {data.months.map((mm, i) => (
          <button className="kbn-row" key={mm.key} onClick={() => A.setMonth(i)}>
            <div className="kbn-rowmain">
              <div className="kbn-t">{monthLong(mm.key)}</div>
              <div className="kbn-m">{mm.closed ? "Closed, read only" : "Open"}</div>
            </div>
            {i === idx ? <Ic n="check" s={17} style={{ color: "var(--brand)" }} /> : <Ic n="right" s={15} style={{ color: "var(--ink-4)" }} />}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 14 }}>
        <Notice icon="lock" body="Closing a month locks it so past records cannot be changed by accident. It can be reopened when needed." />
      </div>
    </Sheet>
  );
}

function FormulaSheet({ ctx }) {
  const { m, A } = ctx;
  const lines = [["Income received", m.totalIncome, "+"], ["Actual expenses", m.totalSpent, "−"],
    ["Savings contributions", m.totalSavings, "−"], ["Long-term contributions", m.totalFunds, "−"]];
  return (
    <Sheet title="Available balance" onClose={A.close}>
      <div className="kbn-card kbn-pad">
        {lines.map(([l, v, op]) => (
          <div className="kbn-kv" key={l}>
            <span>{op} {l}</span><span className="kbn-n" style={{ fontSize: 13.5 }}>{peso(v)}</span>
          </div>
        ))}
        <div className="kbn-kv" style={{ paddingTop: 12 }}>
          <span style={{ fontWeight: 600, color: "var(--ink)", fontSize: 13.5 }}>Available</span>
          <span className="kbn-n" style={{ fontSize: 19 }}>{peso(m.available)}</span>
        </div>
      </div>
      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        <Notice icon="check" body="A budget limit is a plan, not a payment. The full amount is never treated as spent." />
        <Notice icon="check" body="Money put into savings or a long-term fund lowers what is available, but it is not an expense. It is still yours." />
        <Notice icon="swap" body="Transfers between budgets, balances, and goals are never counted twice." />
      </div>
    </Sheet>
  );
}

function BudgetSheet({ ctx, s }) {
  const { m, A, locked, setSheet } = ctx;
  const b = m.rows.find((r) => r.id === s.id);
  if (!b) return null;
  const diff = b.spent - b.expected;
  return (
    <Sheet title={b.name} onClose={A.close}
      foot={!locked && <button className="kbn-btn" onClick={() => setSheet({ type: "add", pick: "expense", budget: b.id })}>
        <Ic n="plus" s={16} /> Record a purchase
      </button>}>
      <section className="kbn-card kbn-pad">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 13 }}>
          <div>
            <div className="kbn-eyebrow">Spent</div>
            <div className="kbn-n" style={{ fontSize: 27, marginTop: 3 }}>{peso(b.spent)}</div>
            <div className="kbn-m">of {peso(b.pool)}{b.carryOver ? ` (${peso(b.amount)} + ${peso(b.carryOver)} carried over)` : ""}</div>
          </div>
          <Tag s={b.status} />
        </div>
        <Track p={b.p} pace={b.pace} h={8} />
        {b.pace > 0 && b.pace < 1 && (
          <div className="kbn-s" style={{ marginTop: 11 }}>
            By day {TODAY.slice(8, 10)} of {daysIn(ctx.key)} an even pace would be <b>{peso(b.expected)}</b>.
            {diff <= 0 ? <> You are <b style={{ color: "var(--pos)" }}>{peso(-diff)} under</b>.</> : <> You are <b style={{ color: "var(--warn)" }}>{peso(diff)} ahead</b>.</>}
          </div>
        )}
        <div className="kbn-3" style={{ marginTop: 14 }}>
          {[["Limit", peso(b.pool)], ["Left", peso(b.remaining)], ["Used", pct(b.p)]].map(([l, v]) => (
            <div key={l}><div className="kbn-eyebrow" style={{ fontSize: 9.5 }}>{l}</div><div className="kbn-n" style={{ fontSize: 15, marginTop: 2 }}>{v}</div></div>
          ))}
        </div>
      </section>

      <section className="kbn-sec">
        <div className="kbn-sechead"><div className="kbn-eyebrow">Funded by</div></div>
        <div className="kbn-list">
          {b.funding.map((f) => (
            <div className="kbn-row" key={f.profile}>
              <Avatar id={f.profile} />
              <div className="kbn-rowmain"><div className="kbn-t">{who(f.profile).name}</div><div className="kbn-m">{who(f.profile).role}</div></div>
              <div className="kbn-n" style={{ fontSize: 13.5 }}>{peso(f.amount)}</div>
            </div>
          ))}
          {b.carryOver > 0 && (
            <div className="kbn-row">
              <span className="kbn-glyph"><Ic n="swap" s={15} /></span>
              <div className="kbn-rowmain"><div className="kbn-t">Carried over</div><div className="kbn-m">Unused balance from last month</div></div>
              <div className="kbn-n" style={{ fontSize: 13.5 }}>{peso(b.carryOver)}</div>
            </div>
          )}
        </div>
      </section>

      <section className="kbn-sec">
        <div className="kbn-sechead"><div className="kbn-eyebrow">Purchases</div><span className="kbn-m">{b.tx.length} recorded</span></div>
        {b.tx.length === 0
          ? <div className="kbn-card"><Empty title="Nothing bought from this budget yet"
              body="The limit is set aside but untouched. Nothing counts as an expense until a purchase is recorded." /></div>
          : <div className="kbn-list">
              {b.tx.map((t) => {
                const content = <>
                  <Avatar id={t.paidBy} />
                  <div className="kbn-rowmain">
                    <div className="kbn-t" style={{ fontWeight: 500 }}>{t.name}</div>
                    <div className="kbn-m">{t.merchant} · {t.method}{t.shared ? "" : " · personal"}</div>
                  </div>
                  <div className="kbn-rowend">
                    <div className="kbn-n" style={{ fontSize: 13.5 }}>{peso(t.amount)}</div>
                    <div className="kbn-m">{dayShort(t.date)}</div>
                  </div>
                  {!locked && <Ic n="right" s={15} style={{ color: "var(--ink-4)", flex: "0 0 auto" }} />}
                </>;
                return locked
                  ? <div className="kbn-row" key={t.id}>{content}</div>
                  : <button className="kbn-row" key={t.id}
                      onClick={() => setSheet({ type: "add", pick: "expense", expense: t.id, budget: b.id })}>
                      {content}
                    </button>;
              })}
            </div>}
      </section>
    </Sheet>
  );
}

function GoalSheet({ ctx, s }) {
  const { data, A, locked, setSheet } = ctx;
  const g = data.goals.find((x) => x.id === s.id);
  if (!g) return null;
  const saved = goalSaved(g), p = saved / g.target;
  return (
    <Sheet title={g.name} onClose={A.close}
      foot={!locked && <button className="kbn-btn" onClick={() => setSheet({ type: "add", pick: "savings", goal: g.id })}>
        <Ic n="plus" s={16} /> Add a contribution
      </button>}>
      <section className="kbn-card kbn-pad" style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "0 0 auto" }}>
          <Ring p={p} size={84} />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <span className="kbn-n" style={{ fontSize: 17 }}>{pct(p)}</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="kbn-eyebrow">Saved so far</div>
          <div className="kbn-n" style={{ fontSize: 24, marginTop: 2 }}>{peso(saved)}</div>
          <div className="kbn-m" style={{ marginTop: 3 }}>of {peso(g.target)} · {peso(g.target - saved)} to go</div>
          <div className="kbn-m">Target date {g.targetDate}</div>
        </div>
      </section>

      <section className="kbn-sec">
        <div className="kbn-sechead"><div className="kbn-eyebrow">Contributions</div></div>
        <div className="kbn-list">
          {g.opening > 0 && (
            <div className="kbn-row">
              <span className="kbn-glyph"><Ic n="vault" s={15} /></span>
              <div className="kbn-rowmain"><div className="kbn-t">Brought forward</div><div className="kbn-m">Balance before June 2026</div></div>
              <div className="kbn-n" style={{ fontSize: 13.5 }}>{peso(g.opening)}</div>
            </div>
          )}
          {[...g.contributions].reverse().map((c, i) => (
            <div className="kbn-row" key={i}>
              <Avatar id={c.profile} />
              <div className="kbn-rowmain"><div className="kbn-t" style={{ fontWeight: 500 }}>{who(c.profile).name}</div><div className="kbn-m">Monthly contribution</div></div>
              <div className="kbn-rowend"><div className="kbn-n" style={{ fontSize: 13.5 }}>{peso(c.amount)}</div><div className="kbn-m">{dayShort(c.date)}</div></div>
            </div>
          ))}
          {g.transfersIn.map((t, i) => (
            <div className="kbn-row" key={"t" + i}>
              <span className="kbn-glyph"><Ic n="swap" s={15} /></span>
              <div className="kbn-rowmain"><div className="kbn-t" style={{ fontWeight: 500 }}>Transferred in</div><div className="kbn-m">{t.from}</div></div>
              <div className="kbn-rowend"><div className="kbn-n" style={{ fontSize: 13.5 }}>{peso(t.amount)}</div><div className="kbn-m">{dayShort(t.date)}</div></div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <Notice icon="check" body="Contributions lower the available balance but never appear in the month's expense total." />
        </div>
      </section>
    </Sheet>
  );
}

function FundSheet({ ctx, s }) {
  const { data, A } = ctx;
  const f = data.funds.find((x) => x.id === s.id);
  if (!f) return null;
  const inn = fundIn(f), out = fundOut(f);
  return (
    <Sheet title={f.name} onClose={A.close}>
      <section className="kbn-card kbn-pad">
        <div className="kbn-eyebrow">Available in the fund</div>
        <div className="kbn-n" style={{ fontSize: 28, marginTop: 3 }}>{peso(inn - out)}</div>
        <div style={{ marginTop: 14 }}>
          <Meter parts={[
            { l: "Spent on the project", v: out, c: "var(--d1)" },
            { l: "Still in the fund", v: inn - out, c: "var(--d3)" },
            { l: "Still needed", v: Math.max(0, f.target - inn), c: "var(--d4)" },
          ]} />
        </div>
        <div style={{ marginTop: 14 }}>
          {[["Contributed so far", inn], ["Spent on the project", out], ["Target", f.target], ["Still needed", Math.max(0, f.target - inn)]].map(([l, v]) => (
            <div className="kbn-kv" key={l}><span>{l}</span><span className="kbn-n" style={{ fontSize: 13.5 }}>{peso(v)}</span></div>
          ))}
        </div>
      </section>

      <section className="kbn-sec">
        <div className="kbn-sechead"><div className="kbn-eyebrow">Funding history</div></div>
        <div className="kbn-list">
          <div className="kbn-row">
            <span className="kbn-glyph"><Ic n="vault" s={15} /></span>
            <div className="kbn-rowmain"><div className="kbn-t">Brought forward</div><div className="kbn-m">Balance before June 2026</div></div>
            <div className="kbn-n" style={{ fontSize: 13.5 }}>{peso(f.opening)}</div>
          </div>
          {[...f.contributions].reverse().map((c, i) => (
            <div className="kbn-row" key={i}>
              <Avatar id={c.profile} />
              <div className="kbn-rowmain"><div className="kbn-t" style={{ fontWeight: 500 }}>{who(c.profile).name}</div><div className="kbn-m">{monthLong(c.month)}</div></div>
              <div className="kbn-n" style={{ fontSize: 13.5 }}>{peso(c.amount)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="kbn-sec">
        <div className="kbn-sechead"><div className="kbn-eyebrow">Project spending</div></div>
        {f.project.length === 0
          ? <div className="kbn-card"><Empty title="The project has not started"
              body="When work begins, record its costs here. They come out of the fund, not the monthly budgets." /></div>
          : <div className="kbn-list">
              {f.project.map((p, i) => (
                <div className="kbn-row" key={i}>
                  <span className="kbn-glyph"><Ic n="wallet" s={15} /></span>
                  <div className="kbn-rowmain"><div className="kbn-t" style={{ fontWeight: 500 }}>{p.name}</div><div className="kbn-m">{dayShort(p.date)} {p.date.slice(0, 4)}</div></div>
                  <div className="kbn-n" style={{ fontSize: 13.5 }}>{peso(p.amount)}</div>
                </div>
              ))}
            </div>}
      </section>
    </Sheet>
  );
}

/* ------------------------------- add flows -------------------------------- */

function AddSheet({ ctx, s }) {
  const { A } = ctx;
  const [pick, setPick] = useState(s.pick || null);
  const kinds = [
    ["expense", "Expense", "Something that was bought"],
    ["income", "Income", "Money that came in"],
    ["savings", "Savings", "Put money into a goal"],
    ["fund", "Long-term", "Add to a project fund"],
    ["transfer", "Transfer", "Move money between places"],
    ["budget", "Budget", "Set a limit for the month"],
    ["newgoal", "Savings card", "Start a new pot with a target"],
    ["newfund", "Long-term fund", "Start saving for a big project"],
  ];
  if (!pick) return (
    <Sheet title="Add a record" onClose={A.close}>
      <div className="kbn-list">
        {kinds.map(([id, t, sub]) => (
          <button className="kbn-row" key={id} onClick={() => setPick(id)}>
            <span className="kbn-glyph"><Ic n={id === "expense" ? "wallet" : id === "income" ? "trend" : id === "savings" ? "goals" : id === "fund" ? "vault" : id === "transfer" ? "swap" : id === "newgoal" ? "goals" : id === "newfund" ? "vault" : "budgets"} s={16} /></span>
            <div className="kbn-rowmain"><div className="kbn-t">{t}</div><div className="kbn-m">{sub}</div></div>
            <Ic n="right" s={15} style={{ color: "var(--ink-4)" }} />
          </button>
        ))}
      </div>
    </Sheet>
  );
  if (pick === "expense") return <ExpenseForm ctx={ctx} s={s} />;
  if (pick === "income") return <IncomeForm ctx={ctx} />;
  if (pick === "savings" || pick === "fund") return <ContributionForm ctx={ctx} s={s} kind={pick} />;
  if (pick === "transfer") return <TransferForm ctx={ctx} />;
  if (pick === "newgoal") return <GoalForm ctx={ctx} kind="goal" />;
  if (pick === "newfund") return <GoalForm ctx={ctx} kind="fund" />;
  return <BudgetForm ctx={ctx} />;
}

function ExpenseForm({ ctx, s }) {
  const { data, m, A, locked, setSheet } = ctx;
  const expense = s.expense ? data.expenses.find((e) => e.id === s.expense && e.month === ctx.key) : null;
  const editing = !!expense;
  const [f, setF] = useState(() => expense ? {
    name: expense.name, amount: String(expense.amount), budget: expense.budget,
    paidBy: expense.paidBy, method: expense.method, merchant: expense.merchant,
    date: expense.date, shared: expense.shared, note: expense.note || "",
  } : {
    name: "", amount: "", budget: s.budget || (m.rows[0] && m.rows[0].id) || "",
    paidBy: (adults()[0] || {}).id, method: "Cash", merchant: "", date: TODAY, shared: true, note: "",
  });
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const b = m.rows.find((r) => r.id === f.budget);
  const original = editing && expense.budget === f.budget ? expense.amount : 0;
  const after = b ? b.spent - original + Number(f.amount || 0) : 0;
  const ok = f.name.trim() && Number(f.amount) > 0 && f.budget;
  const save = () => {
    const next = {
      name: f.name.trim(), amount: Number(f.amount), budget: f.budget, paidBy: f.paidBy, method: f.method,
      merchant: f.merchant.trim() || "—", date: f.date, shared: f.shared, note: f.note.trim(),
    };
    if (editing) A.updateExpense(expense.id, next);
    else A.addExpense(next);
  };

  if (m.rows.length === 0) return (
    <Sheet title="Record an expense" onClose={A.close}
      foot={<button className="kbn-btn" onClick={() => setSheet({ type: "add", pick: "budget" })}>Create a budget first</button>}>
      <Notice icon="alert" title="No budget to put it in"
        body="Every purchase belongs to a budget, so Kaban can show what is left. Create one, then record the expense against it." />
    </Sheet>
  );

  return (
    <Sheet title={editing ? "Edit purchase" : "Record an expense"} onClose={A.close}
      foot={<div style={{ display: "grid", gap: 9 }}>
        <button className="kbn-btn" disabled={!ok || locked} onClick={save}>
          {editing ? "Save changes" : "Save expense"}
        </button>
        {editing && <button className="kbn-btn ghost" disabled={locked}
          style={{ color: "var(--neg)" }} onClick={() => A.deleteExpense(expense.id)}>
          Delete purchase
        </button>}
      </div>}>
      <Field label="What was bought"><input className="kbn-in" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Rice, 25kg" /></Field>
      <div className="kbn-2">
        <Field label="Amount"><Money value={f.amount} onChange={(v) => set("amount", v)} /></Field>
        <Field label="Date"><input className="kbn-in" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} /></Field>
      </div>
      <Field label="Budget">
        <select className="kbn-in" value={f.budget} onChange={(e) => set("budget", e.target.value)}>
          {m.rows.map((r) => <option key={r.id} value={r.id}>{r.name} — {peso(r.remaining)} left</option>)}
        </select>
      </Field>
      {b && Number(f.amount) > 0 && (
        <div style={{ marginBottom: 14 }}>
          <Notice tone={after > b.pool ? "neg" : ""} icon={after > b.pool ? "alert" : "check"}
            body={after > b.pool
              ? `${b.name} would go ${peso(after - b.pool)} over its ${peso(b.pool)} limit. Kaban will ask where the extra comes from.`
              : `${b.name} would be at ${peso(after)} of ${peso(b.pool)}, leaving ${peso(b.pool - after)}.`} />
        </div>
      )}
      <Field label="Who paid">
        <Segmented value={f.paidBy} onChange={(v) => set("paidBy", v)}
          options={adults().map((p) => ({ v: p.id, l: p.name }))} />
      </Field>
      <Field label="Counts as" hint="Shared purchases roll up to the household. Personal ones stay on that member's card.">
        <Segmented value={f.shared ? "s" : "p"} onChange={(v) => set("shared", v === "s")}
          options={[{ v: "s", l: "Shared" }, { v: "p", l: "Personal" }]} />
      </Field>
      <div className="kbn-2">
        <Field label="Payment method">
          <select className="kbn-in" value={f.method} onChange={(e) => set("method", e.target.value)}>
            {["Cash", "GCash", "Card", "Bank transfer"].map((x) => <option key={x}>{x}</option>)}
          </select>
        </Field>
        <Field label="Store"><input className="kbn-in" value={f.merchant} onChange={(e) => set("merchant", e.target.value)} placeholder="Puregold" /></Field>
      </div>
      <Field label="Note"><input className="kbn-in" value={f.note} onChange={(e) => set("note", e.target.value)} placeholder="Optional" /></Field>
    </Sheet>
  );
}

function IncomeForm({ ctx }) {
  const { A } = ctx;
  const [f, setF] = useState({ profile: (adults()[0] || {}).id, source: "", amount: "", date: TODAY, recurring: false });
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const ok = f.source.trim() && Number(f.amount) > 0;
  return (
    <Sheet title="Record income" onClose={A.close}
      foot={<button className="kbn-btn" disabled={!ok} onClick={() => A.addIncome({ ...f, source: f.source.trim(), amount: Number(f.amount) })}>Save income</button>}>
      <Field label="Who earned it">
        <Segmented value={f.profile} onChange={(v) => set("profile", v)}
          options={adults().map((p) => ({ v: p.id, l: p.name }))} />
      </Field>
      <Field label="Source"><input className="kbn-in" value={f.source} onChange={(e) => set("source", e.target.value)} placeholder="Salary" /></Field>
      <div className="kbn-2">
        <Field label="Amount"><Money value={f.amount} onChange={(v) => set("amount", v)} /></Field>
        <Field label="Date received"><input className="kbn-in" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} /></Field>
      </div>
      <Field label="Repeats" hint="Recurring entries are proposed at the start of each month before they are added.">
        <Segmented value={f.recurring ? "y" : "n"} onChange={(v) => set("recurring", v === "y")}
          options={[{ v: "y", l: "Every month" }, { v: "n", l: "One time" }]} />
      </Field>
    </Sheet>
  );
}

function ContributionForm({ ctx, s, kind }) {
  const { data, A, setSheet } = ctx;
  const list = kind === "savings" ? data.goals : data.funds;
  const [f, setF] = useState({ id: s.goal || (list[0] || {}).id, profile: (adults()[0] || {}).id, amount: "", date: TODAY });
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const ok = Number(f.amount) > 0;
  if (list.length === 0) return (
    <Sheet title={kind === "savings" ? "Add to savings" : "Add to a long-term fund"} onClose={A.close}
      foot={<button className="kbn-btn" onClick={() => setSheet({ type: kind === "savings" ? "newgoal" : "newfund" })}>
        {kind === "savings" ? "Create a savings card" : "Create a fund"}</button>}>
      <Notice icon="alert" title={kind === "savings" ? "No savings cards yet" : "No funds yet"}
        body="Contributions go into a named pot with a target, so you can see progress. Create one first." />
    </Sheet>
  );

  return (
    <Sheet title={kind === "savings" ? "Add to savings" : "Add to a long-term fund"} onClose={A.close}
      foot={<button className="kbn-btn" disabled={!ok}
        onClick={() => A.addContribution(kind === "savings" ? "goals" : "funds", f.id, f.profile, Number(f.amount), f.date)}>
        Save contribution</button>}>
      <Field label={kind === "savings" ? "Savings card" : "Fund"}>
        <select className="kbn-in" value={f.id} onChange={(e) => set("id", e.target.value)}>
          {list.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </Field>
      <Field label="From whom">
        <Segmented value={f.profile} onChange={(v) => set("profile", v)}
          options={adults().map((p) => ({ v: p.id, l: p.name }))} />
      </Field>
      <div className="kbn-2">
        <Field label="Amount"><Money value={f.amount} onChange={(v) => set("amount", v)} /></Field>
        <Field label="Date"><input className="kbn-in" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} /></Field>
      </div>
      <Notice icon="check" body="This lowers the available balance but is not an expense. The money is still yours." />
    </Sheet>
  );
}

function TransferForm({ ctx }) {
  const { data, m, A } = ctx;
  const places = [
    { v: "bal", l: "Household available balance", g: "Balances" },
    ...adults().map((p) => ({ v: "p:" + p.id, l: p.name + "'s balance", g: "Balances" })),
    ...m.rows.map((r) => ({ v: "b:" + r.id, l: r.name + " budget", g: "Budgets" })),
    ...data.goals.map((g) => ({ v: "g:" + g.id, l: g.name, g: "Savings" })),
    ...data.funds.map((x) => ({ v: "f:" + x.id, l: x.name, g: "Long-term funds" })),
  ];
  const groups = ["Balances", "Budgets", "Savings", "Long-term funds"];
  const firstSaving = places.find((p) => p.g === "Savings");
  const [f, setF] = useState({ from: "bal", to: (firstSaving || places[1] || places[0]).v, amount: "" });
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const label = (v) => (places.find((p) => p.v === v) || {}).l;
  const ok = Number(f.amount) > 0 && f.from !== f.to;
  const Select = ({ value, onChange }) => (
    <select className="kbn-in" value={value} onChange={(e) => onChange(e.target.value)}>
      {groups.map((g) => (
        <optgroup key={g} label={g}>
          {places.filter((p) => p.g === g).map((p) => <option key={p.v} value={p.v}>{p.l}</option>)}
        </optgroup>
      ))}
    </select>
  );
  return (
    <Sheet title="Move money" onClose={A.close}
      foot={<button className="kbn-btn" disabled={!ok} onClick={() => A.transfer(label(f.from), label(f.to), Number(f.amount))}>Move it</button>}>
      <Field label="From"><Select value={f.from} onChange={(v) => set("from", v)} /></Field>
      <Field label="To"><Select value={f.to} onChange={(v) => set("to", v)} /></Field>
      <Field label="Amount"><Money value={f.amount} onChange={(v) => set("amount", v)} /></Field>
      {f.from === f.to && <div style={{ marginBottom: 14 }}><Notice tone="warn" body="Pick two different places to move money between." /></div>}
      <Notice icon="swap" body="Transfers are never counted twice. The month's expense total does not change." />
    </Sheet>
  );
}

function BudgetForm({ ctx }) {
  const { A } = ctx;
  const ad = adults();
  const [f, setF] = useState({ name: "", amount: "", forChild: false, fund: {} });
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const setFund = (id, v) => setF((x) => ({ ...x, fund: { ...x.fund, [id]: v } }));
  const total = ad.reduce((t, p) => t + Number(f.fund[p.id] || 0), 0);
  const limit = Number(f.amount || 0);
  const ok = f.name.trim() && limit > 0;
  return (
    <Sheet title="Create a budget" onClose={A.close}
      foot={<button className="kbn-btn" disabled={!ok} onClick={() => A.addBudget(f.name.trim(), limit,
        ad.map((p) => ({ profile: p.id, amount: Number(f.fund[p.id] || 0) })).filter((x) => x.amount > 0), f.forChild)}>
        Create budget</button>}>
      <Field label="Name"><input className="kbn-in" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Groceries" /></Field>
      <Field label="Limit for this month" hint="A limit is a plan. Nothing is treated as spent until a purchase is recorded.">
        <Money value={f.amount} onChange={(v) => set("amount", v)} />
      </Field>
      {children().length > 0 && (
        <Field label="Is this spending on a child?">
          <Segmented value={f.forChild ? "y" : "n"} onChange={(v) => set("forChild", v === "y")}
            options={[{ v: "n", l: "No" }, { v: "y", l: "Yes" }]} />
        </Field>
      )}
      <div className="kbn-eyebrow" style={{ margin: "18px 0 9px" }}>Who funds it</div>
      <div className={ad.length > 1 ? "kbn-2" : ""}>
        {ad.map((p) => (
          <Field key={p.id} label={p.name}><Money value={f.fund[p.id] || ""} onChange={(v) => setFund(p.id, v)} /></Field>
        ))}
      </div>
      {limit > 0 && total !== limit && (
        <Notice tone="warn" body={total > limit
          ? `Funding adds up to ${peso(total)}, which is ${peso(total - limit)} more than the limit.`
          : `${peso(limit - total)} of the limit is unassigned. It will be drawn from the household balance.`} />
      )}
    </Sheet>
  );
}

/* --------------------------- over-budget prompt --------------------------- */

function OverSheet({ ctx, s }) {
  const { m, A } = ctx;
  const b = s.budget, excess = s.excess;
  const pool = b.amount + (b.carryOver || 0);
  const opts = [
    { v: "Household available balance", l: "Available income", d: "Draw it from what is still unspent this month" },
    ...m.rows.filter((r) => r.id !== b.id && r.remaining > excess).slice(0, 2)
      .map((r) => ({ v: r.name + " budget", l: "The " + r.name + " budget", d: peso(r.remaining) + " is unused there" })),
    ...ctx.data.goals.slice(0, 1).map((g) => ({ v: g.name, l: g.name, d: "Withdraw from this savings card" })),
    ...adults().slice(0, 2).map((p) => ({ v: p.name + "'s available balance", l: p.name + "'s balance", d: "One member absorbs it personally" })),
  ];
  return (
    <Sheet title={b.name + " is over its limit"} onClose={A.close}>
      <Notice tone="neg" title={`${peso(excess)} over ${peso(pool)}`}
        body="The purchase is saved. Choose where the extra comes from so the books stay balanced." />
      <div className="kbn-list" style={{ marginTop: 14 }}>
        {opts.map((o) => (
          <button className="kbn-row" key={o.v} onClick={() => A.transfer(o.v, b.name + " budget", excess,
            `${peso(excess)} covered from ${o.l.toLowerCase()}. Logged as a transfer.`)}>
            <div className="kbn-rowmain"><div className="kbn-t">{o.l}</div><div className="kbn-m">{o.d}</div></div>
            <Ic n="right" s={15} style={{ color: "var(--ink-4)" }} />
          </button>
        ))}
      </div>
    </Sheet>
  );
}

/* ------------------------------ month review ------------------------------ */

function ReviewSheet({ ctx }) {
  const { data, m, key, A } = ctx;
  const left = m.rows.filter((r) => r.remaining > 0);
  const over = m.rows.filter((r) => r.remaining < 0);
  const dests = [
    { v: "carry", l: "Carry over to " + monthShort(nextKey(key)), g: "Keep in the budget" },
    ...data.goals.map((g) => ({ v: "g:" + g.id, l: g.name, g: "Savings cards" })),
    ...data.funds.map((f) => ({ v: "f:" + f.id, l: f.name, g: "Long-term funds" })),
    { v: "new", l: "Create a new savings card", g: "Savings cards" },
    { v: "return", l: "Return to available balance", g: "Keep in the budget" },
  ];
  const groups = ["Keep in the budget", "Savings cards", "Long-term funds"];

  const [plan, setPlan] = useState(() => {
    const o = {};
    left.forEach((r) => { o[r.id] = { dest: "carry", split: false, a1: Math.round(r.remaining / 2), dest2: "return", newName: "" }; });
    return o;
  });
  const [src, setSrc] = useState(() => {
    const o = {}; over.forEach((r) => { o[r.id] = "Household available balance"; }); return o;
  });
  const upd = (id, k, v) => setPlan((p) => ({ ...p, [id]: { ...p[id], [k]: v } }));
  const totalLeft = left.reduce((t, r) => t + r.remaining, 0);
  const carried = left.reduce((t, r) => {
    const p = plan[r.id];
    if (p.dest === "carry" && !p.split) return t + r.remaining;
    if (p.split && p.dest === "carry") return t + p.a1;
    if (p.split && p.dest2 === "carry") return t + (r.remaining - p.a1);
    return t;
  }, 0);
  const moved = totalLeft - carried;

  const Dest = ({ value, onChange }) => (
    <select className="kbn-in" value={value} onChange={(e) => onChange(e.target.value)}>
      {groups.map((g) => (
        <optgroup key={g} label={g}>
          {dests.filter((d) => d.g === g).map((d) => <option key={d.v} value={d.v}>{d.l}</option>)}
        </optgroup>
      ))}
    </select>
  );

  return (
    <Sheet title={"Close " + monthLong(key)} onClose={A.close}
      foot={
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12 }}>
            <span style={{ color: "var(--ink-2)" }}>{peso(carried)} stays in budgets · {peso(moved)} moves out</span>
            <span className="kbn-n" style={{ fontSize: 12 }}>{peso(totalLeft)} total</span>
          </div>
          <button className="kbn-btn" onClick={() => A.closeMonth({
            rows: left.map((r) => ({ ...r, ...plan[r.id] })),
            over: over.map((r) => ({ name: r.name, excess: -r.remaining, source: src[r.id] })),
          })}>Confirm and close {monthShort(key)}</button>
        </>
      }>

      <section className="kbn-card kbn-pad">
        <div className="kbn-eyebrow">{monthLong(key)} at a glance</div>
        <div style={{ marginTop: 11 }}>
          {[["Income received", m.totalIncome], ["Spent", m.totalSpent], ["Saved", m.totalSavings],
            ["Into long-term funds", m.totalFunds], ["Unspent in budgets", totalLeft]].map(([l, v]) => (
            <div className="kbn-kv" key={l}><span>{l}</span><span className="kbn-n" style={{ fontSize: 13.5 }}>{peso(v)}</span></div>
          ))}
        </div>
      </section>

      {over.length > 0 && (
        <section className="kbn-sec">
          <div className="kbn-sechead"><div className="kbn-eyebrow">1 · Cover the overspend</div></div>
          <div style={{ display: "grid", gap: 10 }}>
            {over.map((r) => (
              <div className="kbn-card kbn-pad" key={r.id} style={{ borderColor: "#EFCFCB" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span className="kbn-t">{r.name}</span>
                  <span className="kbn-n" style={{ fontSize: 14, color: "var(--neg)" }}>{peso(-r.remaining)} over</span>
                </div>
                <select className="kbn-in" value={src[r.id]} onChange={(e) => setSrc((x) => ({ ...x, [r.id]: e.target.value }))}>
                  {["Household available balance", ...data.goals.map((g) => g.name),
                    ...adults().map((p) => p.name + "'s available balance")].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="kbn-sec">
        <div className="kbn-sechead">
          <div className="kbn-eyebrow">{over.length > 0 ? "2 · " : ""}Place what is left</div>
          <span className="kbn-m">{left.length} budgets</span>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {left.map((r) => {
            const p = plan[r.id];
            return (
              <div className="kbn-card kbn-pad" key={r.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 11 }}>
                  <div><div className="kbn-t">{r.name}</div><div className="kbn-m">{peso(r.spent)} spent of {peso(r.pool)}</div></div>
                  <div className="kbn-n" style={{ fontSize: 16 }}>{peso(r.remaining)}</div>
                </div>
                <Dest value={p.dest} onChange={(v) => upd(r.id, "dest", v)} />
                {p.dest === "new" && (
                  <input className="kbn-in" style={{ marginTop: 9 }} value={p.newName} placeholder="Name the new card, e.g. Christmas fund"
                    onChange={(e) => upd(r.id, "newName", e.target.value)} />
                )}
                <button className="kbn-act" onClick={() => upd(r.id, "split", !p.split)}>
                  {p.split ? "Send it all to one place" : "Split between two places"}
                </button>
                {p.split && (
                  <div style={{ marginTop: 10, paddingTop: 12, borderTop: "1px solid var(--hair-2)" }}>
                    <div className="kbn-2">
                      <Field label="Amount to the first">
                        <Money value={String(p.a1)} onChange={(v) => upd(r.id, "a1", Math.min(r.remaining, Number(v || 0)))} />
                      </Field>
                      <Field label={`Rest, ${peso(r.remaining - p.a1)}, to`}>
                        <Dest value={p.dest2} onChange={(v) => upd(r.id, "dest2", v)} />
                      </Field>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div style={{ marginTop: 16 }}>
        <Notice icon="swap" body={`Every move here is recorded as a transfer, not an expense. ${monthLong(key)} becomes read only, and ${monthLong(nextKey(key))} opens with your carry-overs already applied.`} />
      </div>
    </Sheet>
  );
}

/* ==========================================================================
   Persistence, setup, settings and optional cloud sync.
   Everything above this line is the app itself; everything below makes it
   keep your data and live on a device.
   ========================================================================== */

const STORE_KEY = "kaban.state.v1";
const CFG_KEY = "kaban.cloud.v1";
const CLOUD_DEFAULT = {
  url: "https://kymxgnwkxvrbwwyyyfgd.supabase.co",
  key: "sb_publishable_kSyCs_fspG-kgBgU8i5p-Q_zf0xp4YA",
};
const PALETTE = ["#16324B", "#3C6E92", "#265A7D", "#88ABC3", "#5B8CAE", "#6E8CA0"];
const initialsOf = (n) => (n || "").trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";
const adults = () => PEOPLE.filter((p) => p.kind === "adult");
const children = () => PEOPLE.filter((p) => p.kind === "child");

function readLocal() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return p && p.data && p.data.people ? p.data : null;
  } catch (e) { return null; }
}
function writeLocal(data) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ v: 1, savedAt: new Date().toISOString(), data }));
    return true;
  } catch (e) { console.warn("Could not save locally", e); return false; }
}
function clearLocal() {
  try { localStorage.removeItem(STORE_KEY); } catch (e) {}
}
function readCfg() {
  try {
    const saved = JSON.parse(localStorage.getItem(CFG_KEY) || "null");
    return saved || CLOUD_DEFAULT;
  } catch (e) { return CLOUD_DEFAULT; }
}
function writeCfg(cfg) {
  try { cfg ? localStorage.setItem(CFG_KEY, JSON.stringify(cfg)) : localStorage.removeItem(CFG_KEY); } catch (e) {}
}

/* ------------------------------ cloud sync -------------------------------- */

function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector('script[data-sb]')) return res();
    const s = document.createElement("script");
    s.src = src; s.dataset.sb = "1"; s.onload = () => res(); s.onerror = rej;
    document.head.appendChild(s);
  });
}

const SB = {
  client: null, email: null, timer: null,

  async connect(cfg) {
    if (!cfg || !cfg.url || !cfg.key) return null;
    await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js");
    if (!window.supabase) throw new Error("Supabase library did not load");
    this.client = window.supabase.createClient(cfg.url, cfg.key);
    const { data } = await this.client.auth.getSession();
    this.email = data && data.session ? data.session.user.email : null;
    return this.email;
  },
  async signIn(email) {
    if (!this.client) throw new Error("Not connected");
    const { error } = await this.client.auth.signInWithOtp({
      email, options: { emailRedirectTo: window.location.href.split("#")[0] },
    });
    if (error) throw error;
  },
  async signOut() {
    if (this.client) await this.client.auth.signOut();
    this.email = null;
  },
  async pull() {
    if (!this.client || !this.email) return null;
    const { data, error } = await this.client.from("kaban_state").select("state").maybeSingle();
    if (error) { console.warn("Cloud read failed", error.message); return null; }
    return data && data.state && data.state.people ? data.state : null;
  },
  push(state) {
    if (!this.client || !this.email) return;
    clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      const { data } = await this.client.auth.getUser();
      if (!data || !data.user) return;
      const { error } = await this.client.from("kaban_state")
        .upsert({ user_id: data.user.id, state, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
      if (error) console.warn("Cloud save failed", error.message);
    }, 1500);
  },
};

/* ----------------------------- data factory ------------------------------- */

function makeEmpty(householdName, members) {
  const people = members
    .filter((mem) => (mem.name || "").trim())
    .map((mem, i) => ({
      id: uid("p"), name: mem.name.trim(),
      role: mem.kind === "child" ? "Child" : "Adult",
      kind: mem.kind, admin: i === 0,
      c: PALETTE[i % PALETTE.length], i: initialsOf(mem.name),
    }));
  people.push({ id: "house", name: "Household", role: "Shared pot", kind: "shared", c: "#7C868E", i: "HH" });
  return {
    household: (householdName || "").trim() || "My household",
    people,
    months: [{ key: TODAY.slice(0, 7), closed: false }],
    income: [], budgets: [], expenses: [], goals: [], funds: [], transfers: [],
  };
}

/* -------------------------------- setup ----------------------------------- */

function Setup({ onDone }) {
  const [name, setName] = useState("");
  const [rows, setRows] = useState([{ name: "", kind: "adult" }, { name: "", kind: "adult" }]);
  const set = (i, k, v) => setRows((r) => r.map((x, n) => (n === i ? { ...x, [k]: v } : x)));
  const ok = rows.some((r) => r.name.trim());

  return (
    <div className="kbn">
      <style>{CSS}</style>
      <div className="kbn-stage">
        <div className="kbn-lockup">
          <div className="kbn-mark" aria-hidden="true" />
          <div className="kbn-word">Kaban</div>
          <div className="kbn-rule" />
          <div className="kbn-claim">Household money, in one place</div>
        </div>

        <div className="kbn-device">
          <header className="kbn-bar">
            <div>
              <div className="kbn-bartitle">Set up</div>
              <div className="kbn-barsub">This stays on your device</div>
            </div>
          </header>

          <main className="kbn-scroll" style={{ paddingBottom: 24 }}>
            <Field label="What should we call the household?">
              <input className="kbn-in" value={name} onChange={(e) => setName(e.target.value)} placeholder="Reyes household" />
            </Field>

            <div className="kbn-eyebrow" style={{ margin: "20px 0 10px" }}>Who is in it</div>
            <div style={{ display: "grid", gap: 10 }}>
              {rows.map((r, i) => (
                <div className="kbn-card kbn-pad" key={i}>
                  <div className="kbn-2" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
                    <Field label={i === 0 ? "Name (that's you)" : "Name"}>
                      <input className="kbn-in" value={r.name} onChange={(e) => set(i, "name", e.target.value)} placeholder="Maria" />
                    </Field>
                    <Field label="Role">
                      <select className="kbn-in" value={r.kind} onChange={(e) => set(i, "kind", e.target.value)}>
                        <option value="adult">Earns money</option>
                        <option value="child">Child</option>
                      </select>
                    </Field>
                  </div>
                  {rows.length > 1 && (
                    <button className="kbn-act" onClick={() => setRows((x) => x.filter((_, n) => n !== i))}>Remove</button>
                  )}
                </div>
              ))}
            </div>
            <button className="kbn-btn ghost" style={{ marginTop: 12 }}
              onClick={() => setRows((r) => [...r, { name: "", kind: "adult" }])}>
              <Ic n="plus" s={16} /> Add another member
            </button>

            <div style={{ marginTop: 18 }}>
              <Notice icon="shield" body="Everything is stored on this device until you turn on cloud sync in Settings. Nothing is sent anywhere." />
            </div>

            <button className="kbn-btn" style={{ marginTop: 16 }} disabled={!ok}
              onClick={() => onDone(makeEmpty(name, rows))}>Start using Kaban</button>

            <button className="kbn-act" style={{ display: "block", margin: "16px auto 0" }}
              onClick={() => onDone(SAMPLE)}>Explore with sample data instead</button>
          </main>
        </div>

        <p className="kbn-note">
          Add this page to your Home Screen from the Safari share menu and it opens like any other app.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------- settings --------------------------------- */

function SettingsSheet({ ctx }) {
  const { data, A } = ctx;
  const fileRef = useRef(null);
  const [cfg, setCfg] = useState(() => readCfg() || { url: "", key: "" });
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(SB.email ? "in:" + SB.email : "");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("household");

  const exportFile = () => {
    const blob = new Blob([JSON.stringify({ app: "kaban", v: 1, exportedAt: new Date().toISOString(), data }, null, 2)],
      { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "kaban-backup-" + TODAY + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const importFile = (file) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        const parsed = JSON.parse(String(r.result));
        const next = parsed && parsed.data ? parsed.data : parsed;
        if (!next || !next.people || !next.months) throw new Error("Not a Kaban backup");
        A.replaceAll(next);
      } catch (e) { alert("That file could not be read as a Kaban backup.\n\n" + e.message); }
    };
    r.readAsText(file);
  };

  const connect = async () => {
    setBusy(true);
    try {
      writeCfg(cfg);
      const who = await SB.connect(cfg);
      setStatus(who ? "in:" + who : "connected");
    } catch (e) { setStatus("err:" + e.message); }
    setBusy(false);
  };

  const sendLink = async () => {
    setBusy(true);
    try { await SB.signIn(email.trim()); setStatus("sent"); }
    catch (e) { setStatus("err:" + e.message); }
    setBusy(false);
  };

  return (
    <Sheet title="Settings" onClose={A.close}>
      <Segmented value={tab} onChange={setTab} options={[
        { v: "household", l: "Household" }, { v: "data", l: "Backup" }, { v: "cloud", l: "Sync" }]} />

      {tab === "household" && (
        <div style={{ marginTop: 16 }}>
          <Field label="Household name">
            <input className="kbn-in" value={data.household || ""} onChange={(e) => A.setHousehold(e.target.value)} />
          </Field>
          <div className="kbn-eyebrow" style={{ margin: "20px 0 10px" }}>Members</div>
          <div className="kbn-list">
            {data.people.filter((p) => p.kind !== "shared").map((p) => (
              <div className="kbn-row" key={p.id}>
                <Avatar id={p.id} />
                <div className="kbn-rowmain"><div className="kbn-t">{p.name}</div><div className="kbn-m">{p.role}{p.admin ? " · admin" : ""}</div></div>
                {!p.admin && <button className="kbn-act" style={{ margin: 0 }} onClick={() => A.removePerson(p.id)}>Remove</button>}
              </div>
            ))}
          </div>
          <button className="kbn-btn ghost" style={{ marginTop: 12 }} onClick={() => {
            const n = prompt("Name of the new member");
            if (n && n.trim()) A.addPerson(n.trim(), confirm("Is this a child? OK for child, Cancel for an adult who earns.") ? "child" : "adult");
          }}><Ic n="plus" s={16} /> Add a member</button>

          <div className="kbn-eyebrow" style={{ margin: "22px 0 10px" }}>Months</div>
          <button className="kbn-btn ghost" onClick={A.addMonth}><Ic n="calendar" s={16} /> Start the next month</button>
          <div className="kbn-m" style={{ marginTop: 8 }}>
            Normally the next month is created for you when you close the current one. Use this if you need it early.
          </div>
        </div>
      )}

      {tab === "data" && (
        <div style={{ marginTop: 16 }}>
          <Notice icon="shield" title="Back up regularly"
            body="Your records live in this browser's storage. Clearing Safari data would erase them, so keep an exported copy in Files or iCloud Drive." />
          <button className="kbn-btn" style={{ marginTop: 14 }} onClick={exportFile}>
            <Ic n="export" s={16} /> Export a backup file
          </button>
          <button className="kbn-btn ghost" style={{ marginTop: 10 }} onClick={() => fileRef.current && fileRef.current.click()}>
            Restore from a backup file
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) importFile(f); e.target.value = ""; }} />
          <div className="kbn-m" style={{ marginTop: 10, lineHeight: 1.6 }}>
            Restoring replaces everything currently in the app. Export first if you are not sure.
          </div>

          <div className="kbn-eyebrow" style={{ margin: "26px 0 10px" }}>Start over</div>
          <button className="kbn-btn ghost" style={{ color: "var(--neg)", borderColor: "#EFCFCB" }}
            onClick={() => { if (confirm("Erase everything on this device and set up again? Export a backup first if you want to keep it.")) A.wipe(); }}>
            Erase and set up again
          </button>
        </div>
      )}

      {tab === "cloud" && (
        <div style={{ marginTop: 16 }}>
          <Notice icon="shield" title="Optional"
            body="Sync keeps the same records on your iPad and phone. Skip it if one device is enough — backups already cover you." />
          <div style={{ marginTop: 14 }}>
            <Field label="Supabase project URL" hint="Settings → API in your Supabase dashboard">
              <input className="kbn-in" value={cfg.url} placeholder="https://xxxx.supabase.co"
                onChange={(e) => setCfg({ ...cfg, url: e.target.value.trim() })} />
            </Field>
            <Field label="Publishable key" hint="Safe to store here as long as row level security is on, per the README. Never use a secret key.">
              <input className="kbn-in" value={cfg.key} placeholder="sb_publishable_..."
                onChange={(e) => setCfg({ ...cfg, key: e.target.value.trim() })} />
            </Field>
            <button className="kbn-btn ghost" disabled={busy || !cfg.url || !cfg.key} onClick={connect}>
              {busy ? "Working…" : "Connect"}
            </button>
          </div>

          {status && status.indexOf("in:") === 0 ? (
            <div style={{ marginTop: 16 }}>
              <Notice icon="check" title="Signed in" body={status.slice(3) + " · changes save to the cloud automatically."} />
              <button className="kbn-btn ghost" style={{ marginTop: 12 }}
                onClick={async () => { await SB.signOut(); setStatus(""); }}>Sign out</button>
            </div>
          ) : (
            <div style={{ marginTop: 16 }}>
              <Field label="Sign in with a link" hint="Supabase emails you a link. Open it on this device.">
                <input className="kbn-in" type="email" value={email} placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <button className="kbn-btn" disabled={busy || !email.trim() || !SB.client} onClick={sendLink}>
                {busy ? "Sending…" : "Email me a sign-in link"}
              </button>
              {!SB.client && <div className="kbn-m" style={{ marginTop: 8 }}>Connect the project first.</div>}
            </div>
          )}

          {status === "sent" && <div style={{ marginTop: 14 }}><Notice icon="check" body="Link sent. Open it on this device to finish signing in." /></div>}
          {status === "connected" && <div style={{ marginTop: 14 }}><Notice icon="check" body="Project connected. Sign in to start syncing." /></div>}
          {status.indexOf("err:") === 0 && <div style={{ marginTop: 14 }}><Notice tone="neg" body={status.slice(4)} /></div>}
        </div>
      )}
    </Sheet>
  );
}

/* --------------------------- create goal / fund --------------------------- */

function GoalForm({ ctx, kind }) {
  const { A } = ctx;
  const isFund = kind === "fund";
  const [f, setF] = useState({ name: "", target: "", date: "", forChild: false });
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const ok = f.name.trim() && Number(f.target) > 0;
  return (
    <Sheet title={isFund ? "New long-term fund" : "New savings card"} onClose={A.close}
      foot={<button className="kbn-btn" disabled={!ok} onClick={() => A.addGoalOrFund(isFund ? "funds" : "goals", {
        name: f.name.trim(), target: Number(f.target),
        targetDate: f.date ? MS[Number(f.date.slice(5, 7)) - 1] + " " + f.date.slice(0, 4) : "Not set",
        forChild: f.forChild,
      })}>Create</button>}>
      <Field label="Name">
        <input className="kbn-in" value={f.name} onChange={(e) => set("name", e.target.value)}
          placeholder={isFund ? "House construction" : "Emergency fund"} />
      </Field>
      <Field label="Target amount"><Money value={f.target} onChange={(v) => set("target", v)} /></Field>
      <Field label="Target date" hint="Optional. Used to show how much you need to put in each month.">
        <input className="kbn-in" type="month" value={f.date} onChange={(e) => set("date", e.target.value)} />
      </Field>
      {!isFund && children().length > 0 && (
        <Field label="Is this saved for a child?">
          <Segmented value={f.forChild ? "y" : "n"} onChange={(v) => set("forChild", v === "y")}
            options={[{ v: "n", l: "No" }, { v: "y", l: "Yes" }]} />
        </Field>
      )}
      <Notice icon="check" body={isFund
        ? "A fund holds money for one project. Contributions are not expenses; only project spending is."
        : "Money in a savings card lowers the available balance but is never counted as an expense."} />
    </Sheet>
  );
}

/* --------------------------------- root ----------------------------------- */

function Splash() {
  return (
    <div className="kbn">
      <style>{CSS}</style>
      <div className="kbn-stage" style={{ justifyContent: "center", minHeight: "60vh" }}>
        <div className="kbn-lockup"><div className="kbn-mark" /><div className="kbn-word">Kaban</div></div>
        <div className="kbn-m">Opening your records…</div>
      </div>
    </div>
  );
}

function Root() {
  const [boot, setBoot] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      const local = readLocal();
      const cfg = readCfg();
      if (cfg && cfg.url && cfg.key) {
        try {
          const who = await SB.connect(cfg);
          if (who) {
            const remote = await SB.pull();
            if (live && remote) { writeLocal(remote); setBoot(remote); setReady(true); return; }
            if (local) SB.push(local);
          }
        } catch (e) { console.warn("Cloud unavailable, using local copy", e); }
      }
      if (live) { setBoot(local); setReady(true); }
    })();
    return () => { live = false; };
  }, []);

  if (!ready) return <Splash />;
  if (!boot) return <Setup onDone={(d) => { writeLocal(d); setBoot(d); }} />;
  return <Kaban key="app" boot={boot} onWipe={() => { clearLocal(); setBoot(null); }} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
