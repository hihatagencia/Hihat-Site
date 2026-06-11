export const injectCSS = () => {
  if (document.getElementById('hihat-css')) return
  const el = document.createElement('style')
  el.id = 'hihat-css'
  el.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:    #0D0D0D;
  --bg2:   #141414;
  --bg3:   #1a1a1a;
  --bg4:   #222222;
  --fg:    #ffffff;
  --fg70:  rgba(255,255,255,.7);
  --fg40:  rgba(255,255,255,.4);
  --fg15:  rgba(255,255,255,.08);
  --border: rgba(255,255,255,.08);
  --border2: rgba(255,255,255,.14);
  --a1: #FFD700;
  --a2: #FF6B00;
  --a3: #FF1744;
  --grad: linear-gradient(135deg,#FFD700 0%,#FF6B00 55%,#FF1744 100%);
  --grad-text: linear-gradient(135deg,#FFD700,#FF6B00,#FF1744);
  --grad-soft: linear-gradient(135deg,rgba(255,215,0,.1),rgba(255,107,0,.08),rgba(255,23,68,.06));
  --sans: 'Plus Jakarta Sans', sans-serif;
  --mono: 'Space Mono', monospace;
  --r4: 4px; --r8: 8px; --r12: 12px; --r16: 16px; --r24: 24px; --r100: 100px;
}

html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--fg); font-family: var(--sans); overflow-x: hidden; }
::selection { background: var(--a2); color: #fff; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--a2); }

/* Gradient utils */
.g-text { background: var(--grad-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.g-bg   { background: var(--grad); }

/* Buttons */
.btn-grad {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--grad); border: none; border-radius: var(--r100);
  font-family: var(--sans); font-size: 13px; font-weight: 700; color: #fff;
  cursor: pointer; padding: 12px 26px; transition: opacity .2s, transform .2s; letter-spacing: .2px;
}
.btn-grad:hover { opacity: .85; transform: translateY(-1px); }
.btn-grad:disabled { opacity: .4; cursor: not-allowed; transform: none; }

.btn-outline {
  display: inline-flex; align-items: center; gap: 8px;
  background: none; border: 1.5px solid var(--border2); border-radius: var(--r100);
  font-family: var(--sans); font-size: 13px; font-weight: 600; color: var(--fg70);
  cursor: pointer; padding: 11px 22px; transition: all .2s;
}
.btn-outline:hover { border-color: var(--fg70); color: var(--fg); }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  background: none; border: none; font-family: var(--sans);
  font-size: 13px; font-weight: 600; color: var(--fg40); cursor: pointer; transition: color .2s;
}
.btn-ghost:hover { color: var(--fg); }

.btn-danger {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.25);
  border-radius: var(--r8); font-family: var(--sans); font-size: 12px;
  font-weight: 600; color: #ef4444; cursor: pointer; padding: 7px 14px; transition: all .2s;
}
.btn-danger:hover { background: rgba(239,68,68,.2); }

.btn-icon {
  width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center;
  background: var(--fg15); border: 1px solid var(--border2); border-radius: var(--r8);
  cursor: pointer; color: var(--fg40); transition: all .2s; flex-shrink: 0;
}
.btn-icon:hover { border-color: var(--a2); color: var(--a2); background: rgba(255,107,0,.08); }
.btn-icon.del:hover { border-color: #ef4444; color: #ef4444; background: rgba(239,68,68,.08); }

/* Inputs */
.field { display: flex; flex-direction: column; gap: 5px; }
.field label { font-family: var(--mono); font-size: 9px; font-weight: 700; color: var(--fg40); letter-spacing: 1.5px; text-transform: uppercase; }
.fi {
  background: var(--fg15); border: 1px solid var(--border2); border-radius: var(--r8);
  padding: 10px 13px; color: var(--fg); font-family: var(--sans); font-size: 14px;
  outline: none; transition: border-color .2s; width: 100%;
}
.fi:focus { border-color: var(--a2); }
.fi::placeholder { color: var(--fg40); }
.fta {
  background: var(--fg15); border: 1px solid var(--border2); border-radius: var(--r8);
  padding: 10px 13px; color: var(--fg); font-family: var(--sans); font-size: 14px;
  outline: none; resize: vertical; min-height: 100px; transition: border-color .2s; width: 100%;
}
.fta:focus { border-color: var(--a2); }
.fta::placeholder { color: var(--fg40); }
select.fi { cursor: pointer; }

/* Card */
.card {
  background: var(--bg3); border: 1px solid var(--border); border-radius: var(--r16);
  padding: 24px;
}

/* Section label */
.sec-label {
  font-family: var(--mono); font-size: 9px; font-weight: 700; letter-spacing: 3px;
  text-transform: uppercase; color: var(--a2); display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
}
.sec-label::before { content: ''; width: 18px; height: 1px; background: var(--a2); }

/* Badge */
.badge { display: inline-block; padding: 3px 9px; border-radius: var(--r4); font-family: var(--mono); font-size: 9px; font-weight: 700; letter-spacing: .5px; }
.badge-active   { background: rgba(34,197,94,.1);   border: 1px solid rgba(34,197,94,.2);   color: #22c55e; }
.badge-viewed   { background: rgba(255,107,0,.1);   border: 1px solid rgba(255,107,0,.2);   color: var(--a2); }
.badge-accepted { background: rgba(34,197,94,.15);  border: 1px solid rgba(34,197,94,.3);   color: #22c55e; }
.badge-declined { background: rgba(239,68,68,.1);   border: 1px solid rgba(239,68,68,.2);   color: #ef4444; }

/* Toast */
.toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  background: var(--bg3); border: 1px solid var(--border2); border-radius: var(--r8);
  padding: 10px 20px; font-family: var(--mono); font-size: 11px; z-index: 9999;
  white-space: nowrap; animation: toastin .3s ease; color: var(--fg); letter-spacing: .5px; text-transform: uppercase;
}
.toast.err { border-color: rgba(239,68,68,.4); color: #ef4444; }
.toast.ok  { border-color: rgba(34,197,94,.3); color: #22c55e; }
@keyframes toastin { from { opacity:0; transform: translateX(-50%) translateY(8px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }

/* Overlay / Modal */
.overlay {
  position: fixed; inset: 0; z-index: 500; background: rgba(0,0,0,.85);
  backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal {
  background: var(--bg3); border: 1px solid var(--border2); border-radius: var(--r16);
  width: 100%; max-width: 720px; max-height: 90vh; overflow-y: auto; padding: 36px;
}

/* Add btn */
.add-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  background: transparent; border: 1.5px dashed var(--border2); color: var(--fg40);
  border-radius: var(--r8); padding: 9px 14px; font-size: 12px; cursor: pointer;
  transition: all .2s; width: 100%; font-family: var(--sans);
}
.add-btn:hover { border-color: var(--a2); color: var(--a2); }

/* Nav */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200; padding: 20px 52px;
  display: flex; align-items: center; justify-content: space-between; transition: all .3s;
}
.nav.stuck {
  background: rgba(13,13,13,.96); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border); padding: 13px 52px;
}

/* Sidebar admin */
.adm-wrap { display: flex; min-height: 100vh; background: var(--bg); }
.adm-sidebar {
  width: 220px; background: var(--bg2); border-right: 1px solid var(--border);
  padding: 22px 14px; display: flex; flex-direction: column; flex-shrink: 0;
  position: sticky; top: 0; height: 100vh;
}
.adm-main { flex: 1; padding: 40px; overflow-y: auto; }
.sb-item {
  display: flex; align-items: center; gap: 9px; padding: 9px 11px;
  border-radius: var(--r8); font-size: 13px; color: var(--fg40); cursor: pointer;
  transition: all .2s; border: none; background: none; width: 100%; text-align: left;
  font-family: var(--sans);
}
.sb-item:hover { background: var(--fg15); color: var(--fg); }
.sb-item.on { background: rgba(255,107,0,.1); color: var(--a2); border: 1px solid rgba(255,107,0,.2); }

/* Responsive */
@media(max-width: 768px) {
  .nav, .nav.stuck { padding: 13px 18px; }
  .adm-wrap { flex-direction: column; }
  .adm-sidebar { width: 100%; height: auto; position: static; }
  .adm-main { padding: 20px; }
  .modal { padding: 20px; }
}
  `
  document.head.appendChild(el)
}
