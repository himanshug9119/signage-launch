// Scenes for the ScreenSetu launch video. Each scene: build(layer) -> state, render(u, state).
// u = scene time in seconds (base timing; see timeline.js). Layout values use L(landscape, portrait).

// ---------- shared bits ----------
const SPLIT = {
  app: L({x: 50, y: 260, s: .74}, {x: -90, y: 450, s: .80}),
  venue: L({x: 1180, y: 330, w: 700, h: 520}, {x: 50, y: 1210, w: 980, h: 600}),
};
function splitApp(layer) { const a = app(layer, SPLIT.app.s); place(a, SPLIT.app.x, SPLIT.app.y); return a }
function splitVenue(layer, type, label, opt = {}) { const v = venue(layer, type, SPLIT.venue.w, SPLIT.venue.h, Object.assign({label}, opt)); place(v, SPLIT.venue.x, SPLIT.venue.y); return v }
const usbSVG = `<svg viewBox="0 0 200 200" width="100%" height="100%"><g fill="none" stroke="#94A3B8" stroke-width="7" stroke-linejoin="round"><rect x="62" y="70" width="76" height="110" rx="14" fill="#1E293B"/><rect x="76" y="22" width="48" height="48" rx="4" fill="#0F172A"/><rect x="88" y="36" width="9" height="9" fill="#94A3B8" stroke="none"/><rect x="104" y="36" width="9" height="9" fill="#94A3B8" stroke="none"/><circle cx="100" cy="128" r="12"/></g><path class="xa" d="M30 30 L170 170" stroke="#EF4444" stroke-width="14" stroke-linecap="round" fill="none" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/><path class="xb" d="M170 30 L30 170" stroke="#EF4444" stroke-width="14" stroke-linecap="round" fill="none" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></svg>`;
const vanSVG = `<svg viewBox="0 0 240 200" width="100%" height="100%"><g fill="#1E293B" stroke="#94A3B8" stroke-width="7" stroke-linejoin="round"><path d="M20 60 h120 v80 h-120 z"/><path d="M140 85 h45 l30 30 v25 h-75 z"/><path d="M160 92 h22 l18 20 h-40 z" fill="#0F172A"/><circle cx="62" cy="148" r="17" fill="#0F172A"/><circle cx="182" cy="148" r="17" fill="#0F172A"/></g><g transform="translate(20,0)"><path class="xa" d="M30 30 L170 170" stroke="#EF4444" stroke-width="14" stroke-linecap="round" fill="none" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/><path class="xb" d="M170 30 L30 170" stroke="#EF4444" stroke-width="14" stroke-linecap="round" fill="none" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></g></svg>`;
const thumb = k => `<img class="thumb" src="${MEDIA[k]}">`;
const st = on => on ? `<span class="st on"><i></i>ONLINE</span>` : `<span class="st off"><i></i>OFFLINE</span>`;

// ================= 1. HOOK =================
scene('hook', layer => {
  const v = venue(layer, 'cafe', W, H, {full: true, clock: true, tvW: L(980, 900), tvTop: L(150, 470)});
  if (PORT) { v.clock.style.left = (W / 2 - 70) + 'px'; v.clock.style.top = '230px' }
  v.tv.show('dinner');
  const badge = el(v.tv.scr, `<div class="abs" style="right:3%;top:5%;padding:6px 14px;border-radius:8px;background:#EF4444;color:#fff;font-weight:800;font-size:${L(20, 20)}px;letter-spacing:.06em;opacity:0">OUTDATED</div>`);
  const shade = el(layer, `<div class="abs" style="left:0;right:0;bottom:0;height:${L(420, 760)}px;background:linear-gradient(transparent,rgba(5,6,10,.92))"></div>`);
  const t1 = el(layer, `<div class="cap h2" style="top:${L(770, 1230)}px;font-size:${L(64, 72)}px;padding:0 50px">${wordsHTML("It's 8 AM. Breakfast rush.")}</div>`);
  const t2 = el(layer, `<div class="cap h2" style="top:${L(860, 1420)}px;font-size:${L(64, 72)}px;padding:0 50px">${wordsHTML("Your screen still says {rd}dinner.")}</div>`);
  return {v, badge, t1, t2};
}, (u, s) => {
  s.v.style.transform = `scale(${1 + u * .012})`; s.v.style.transformOrigin = '50% 35%';
  s.v.setTime(8 + u / 60);
  wordsIn(s.t1, u, .5, .09); wordsIn(s.t2, u, 2.9, .1);
  const b = u > 3.1; s.badge.style.opacity = b ? .75 + .25 * Math.sin(u * 7) : 0;
  s.v.tv.querySelector('.tvs').style.filter = u > 3.1 ? `saturate(${1 - .5 * P(u, 3.1, .6)}) brightness(${1 - .25 * P(u, 3.1, .6)})` : 'none';
});

// ================= 2. PROBLEM =================
scene('problem', layer => {
  const sz = L(330, 300);
  const usb = el(layer, `<div class="abs">${usbSVG}</div>`); box(usb, L(500, 150), L(220, 560), sz, sz);
  const van = el(layer, `<div class="abs">${vanSVG}</div>`); box(van, L(1060, 600), L(220, 560), sz * 1.2, sz);
  const t1 = el(layer, `<div class="cap h2" style="top:${L(640, 1020)}px;padding:0 60px;font-size:${L(60, 66)}px">${wordsHTML('Changing it means a USB stick — or a site visit.')}</div>`);
  const t2 = el(layer, `<div class="cap h1" style="top:${L(800, 1320)}px">${wordsHTML('{gr}Not {gr}anymore.')}</div>`);
  return {usb, van, t1, t2};
}, (u, s) => {
  const a = eo(P(u, .1, .6)), b = eo(P(u, .3, .6));
  show(s.usb, a, `translateX(${(1 - a) * -160}px) rotate(${(1 - a) * -12}deg)`);
  show(s.van, b, `translateX(${(1 - b) * 200}px)`);
  const dash = (root, a) => { root.querySelector('.xa').style.strokeDashoffset = 100 - 100 * eo(P(u, a, .25)); root.querySelector('.xb').style.strokeDashoffset = 100 - 100 * eo(P(u, a + .15, .25)) };
  dash(s.usb, 2.0); dash(s.van, 2.5);
  if ((u > 2 && u < 2.2) || (u > 2.5 && u < 2.7)) window.SHAKE = 6;
  wordsIn(s.t1, u, .4, .07); wordsIn(s.t2, u, 3.3, .15, .5, 30);
});

// ================= 3. LOGO =================
scene('logo', layer => {
  const g = el(layer, `<div class="abs" style="inset:0"></div>`);
  const icon = el(g, `<svg class="abs" viewBox="0 0 120 100"><rect class="fg" x="12" y="10" width="96" height="58" rx="5" fill="url(#lg)" filter="url(#glow)" opacity="0"/><rect class="f" x="12" y="10" width="96" height="58" rx="5" fill="url(#lg)" opacity="0"/><rect class="o" x="6" y="4" width="108" height="70" rx="8" fill="none" stroke="#3B82F6" stroke-width="7" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/><path class="n" d="M60 76 V88" stroke="#3B82F6" stroke-width="8" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" fill="none"/><path class="s" d="M40 88 H80" stroke="#3B82F6" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" fill="none"/></svg>`);
  const wm = el(g, `<div class="abs" style="font-size:${L(120, 112)}px;font-weight:800;letter-spacing:-.04em;white-space:nowrap">${[...'ScreenSetu'].map((c, i) => `<span class="w" style="color:${i >= 6 ? '#3B82F6' : '#fff'}">${c}</span>`).join('')}</div>`);
  const eye = el(layer, `<div class="cap eyebrow" style="top:${L(640, 1060)}px">${[...'DIGITAL SIGNAGE THAT JUST WORKS'].map(c => c === ' ' ? ' ' : `<span class="w">${c}</span>`).join('')}</div>`);
  const tag = el(layer, `<div class="cap" style="top:${L(700, 1120)}px;font-size:${L(62, 66)}px;font-weight:800;letter-spacing:-.03em;line-height:1.15;padding:0 60px">${wordsHTML('Every {bl}screen in your {bl}business, under your {bl}control.')}</div>`);
  return {g, icon, wm, eye, tag};
}, (u, s) => {
  const ic = s.icon;
  ic.querySelector('.o').style.strokeDashoffset = 100 - 100 * eio(P(u, .1, 1.0));
  ic.querySelector('.n').style.strokeDashoffset = 100 - 100 * eio(P(u, .9, .4));
  ic.querySelector('.s').style.strokeDashoffset = 100 - 100 * eio(P(u, 1.1, .4));
  const f = eo(P(u, 1.3, .6)); ic.querySelector('.f').setAttribute('opacity', f); ic.querySelector('.fg').setAttribute('opacity', f * (.8 + .2 * Math.sin(u * 4)));
  const m = eio(P(u, 1.9, .7)), wmW = s.wm.offsetWidth, big = L(300, 300), small = big * .62;
  const iw = lerp(big, small, m), total = small + 36 + wmW;
  const cy = L(400, 820);
  const ix = lerp((W - big) / 2, (W - total) / 2, m), iy = cy - iw * 100 / 120 / 2;
  Object.assign(ic.style, {left: ix + 'px', top: iy + 'px', width: iw + 'px', height: iw * 100 / 120 + 'px'});
  s.wm.style.left = ((W - total) / 2 + small + 36) + 'px'; s.wm.style.top = (cy - s.wm.offsetHeight / 2 - 6) + 'px';
  [...s.wm.children].forEach((c, i) => { const e = eo(P(u, 2.2 + i * .06, .4)); c.style.opacity = e; c.style.transform = `translateY(${(1 - e) * 40}px)` });
  [...s.eye.querySelectorAll('.w')].forEach((c, i) => c.style.opacity = P(u, 3.0 + i * .018, .15));
  wordsIn(s.tag, u, 3.4, .09, .5, 36);
  s.g.style.transform = `scale(${1 + P(u, 2.6, 5) * .04})`;
});

// ================= 4. OVERVIEW =================
function overviewPage(a) {
  const kpi = (ic, col, bg, val, lbl) => `<div class="uc" style="display:flex;gap:16px;align-items:center;padding:20px 22px"><div style="width:52px;height:52px;border-radius:12px;background:${bg};display:flex;align-items:center;justify-content:center">${svgI(ic, col).replace('<svg', '<svg width="28" height="28"')}</div><div><div class="kv" data-v="${val}" style="font-size:26px;font-weight:700">${val}</div><div style="color:#94A3B8;font-size:15px;margin-top:2px">${lbl}</div></div></div>`;
  const up = [['breakfast-menu.png', 'IMAGE'], ['lunch-menu.png', 'IMAGE'], ['weekend-offer.png', 'IMAGE'], ['welcome.png', 'IMAGE'], ['store-tour.mp4', 'VIDEO']];
  const scr = [['PUNE_Cafe_001', 'Just now'], ['MUM_Lobby_002', 'Just now'], ['BLR_Store_003', '1 min ago'], ['DEL_Metro_004', 'Just now']];
  return a.page('ov', 'Dashboard', 'dash', `
   <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px">
    ${kpi('devices', '#5B8DEF', '#1B2640', '12/12', 'Screens Active')}${kpi('loc', '#34D399', '#123028', '3', 'Locations Configured')}${kpi('pl', '#A78BFA', '#2a2148', '8', 'Playlists Created')}${kpi('sch', '#FBBF24', '#3a2c12', '5', 'Active Rotations')}
   </div>
   <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:20px">
    <div class="uc" style="padding:20px 24px"><div style="font-size:14px;font-weight:700;letter-spacing:.1em;color:#94A3B8;margin-bottom:8px">RECENT UPLOADS</div>
     ${up.map(([n, t]) => `<div class="rw" style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(148,163,184,.08)"><div><div style="font-weight:600">${n}</div><div style="color:#94A3B8;font-size:13px;margin-top:3px">${t}</div></div><div style="color:#94A3B8;font-size:14px">Oct 9, 2026</div></div>`).join('')}</div>
    <div class="uc" style="padding:20px 24px"><div style="font-size:14px;font-weight:700;letter-spacing:.1em;color:#94A3B8;margin-bottom:8px">RECENT SCREENS</div>
     ${scr.map(([n, t]) => `<div class="rw" style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid rgba(148,163,184,.08)"><div><div style="font-weight:600">${n}</div><div style="margin-top:5px">${st(true)}</div></div><div style="color:#94A3B8;font-size:14px">${t}</div></div>`).join('')}</div>
   </div>`);
}
scene('overview', layer => {
  const cap = caption(layer, {title: 'One dashboard. {grad}Every {grad}screen.', sub: 'Devices, content, playlists, schedules and settings — in one place.'});
  const shots = ['d03', 'd04', 'd05', 'd09'].map(k => el(layer, `<div class="shot"><img src="assets/shot-${k}.png"></div>`));
  const sw = L(1150, 900);
  shots.forEach((e, i) => { e.style.width = sw + 'px'; e.style.left = L(250 + i * 110, 90 + i * 0) + 'px'; e.style.top = L(260 + i * 50, 470 + i * 300) + 'px' });
  const persp = el(layer, `<div class="abs" style="inset:0;perspective:2400px"></div>`);
  shots.forEach(e => persp.appendChild(e));
  const a = app(layer, L(.86, .717)); place(a, L((W - 1440 * .86) / 2, 22), L(250, 520));
  overviewPage(a); a.go('ov');
  return {cap, shots, a};
}, (u, s) => {
  s.cap.anim(u, .1);
  s.shots.forEach((e, i) => {
    const a = spring(P(u, .3 + i * .35, 1.1) * 1.6), out = eio(P(u, 4.3 + i * .08, .6));
    e.style.opacity = clamp(P(u, .3 + i * .35, .3)) * (1 - out);
    e.style.transform = PORT ? `translateY(${(1 - a) * 300 - out * 200}px) rotateX(${lerp(20, 6, a)}deg) scale(${.96 + .04 * a})`
      : `translateX(${(1 - a) * 700 - out * 600}px) rotateY(${lerp(-28, -12, a)}deg) rotateX(4deg)`;
  });
  const ae = spring(P(u, 4.6, 1.0) * 1.6);
  s.a.style.opacity = clamp(P(u, 4.6, .3)); s.a.style.transform = `scale(${s.a.sc * (.9 + .1 * ae)}) translateY(${(1 - ae) * 60}px)`;
  s.a.querySelectorAll('.kv').forEach((k, i) => { const v = k.dataset.v, p = eo(P(u, 5.2 + i * .12, .9)); k.textContent = v.includes('/') ? Math.round(12 * p) + '/12' : Math.round(+v * p) });
  s.a.querySelectorAll('.rw').forEach((r, i) => rise(r, u, 5.4 + (i % 5) * .08, .4, 14));
});

// ================= 5. PAIR =================
scene('pair', layer => {
  const cap = caption(layer, {n: 1, ch: 'Pair a screen', title: 'Pair a TV in {grad}seconds.', sub: 'Generate a code in the dashboard, type it on the TV — it’s live.'});
  const a = splitApp(layer);
  const pg = a.page('dev', 'Devices', 'devices', `
    <div style="display:flex;justify-content:flex-end;gap:12px"><span class="ub ol">⬇ Download Player App</span><span class="ub pairbtn">＋ Pair Screen</span></div>
    <div class="uc" style="margin-top:18px;padding:14px 16px;display:flex;gap:12px;align-items:center"><div class="ui" style="flex:1;color:#64748B">Search screens by name...</div><div class="ui sel" style="width:160px">All Statuses</div><div class="ui sel" style="width:160px">Sort by Name</div><span style="font-size:12px;color:#64748B;font-weight:700;letter-spacing:.06em;margin-left:8px">VIEW MODE:</span><span class="ub" style="padding:7px 12px;font-size:13px">Grouped</span><span style="font-size:13px;color:#94A3B8">Flat List</span></div>
    <div class="uc" style="margin-top:18px;padding:18px 20px">
      <div style="display:flex;justify-content:space-between;align-items:center"><div style="font-weight:700;font-size:17px">📍 Pune Café</div><span class="cnt" style="font-size:13px;color:#94A3B8;background:#1E293B;padding:4px 10px;border-radius:99px">0 / 0 Online</span></div>
      <div class="empty" style="margin-top:16px;border:1px dashed rgba(148,163,184,.25);border-radius:12px;padding:40px;text-align:center;color:#94A3B8"><div style="font-size:30px">📍</div><div style="font-weight:700;color:#E2E8F0;margin-top:6px">No screens in this location</div><div style="font-size:13px;margin-top:6px">Pair a screen or reassign one to this location directory to activate it.</div></div>
      <div class="dcard" style="margin-top:16px;border:1px solid rgba(148,163,184,.15);border-radius:12px;padding:16px;display:flex;align-items:center;gap:16px;opacity:0">
        <img class="thumb" src="${MEDIA.welcome}" style="width:96px;height:54px"><div style="flex:1"><div style="display:flex;gap:10px;align-items:center"><b style="font-size:16px">PUNE_Cafe_001</b><span class="dst">${st(false)}</span></div><div style="font-size:13px;color:#94A3B8;margin-top:6px">Seen: just now</div></div>
        <div style="font-size:12px;color:#64748B;font-weight:700">LOCATION:</div><div class="ui sel" style="width:150px;min-height:38px;font-size:14px">Pune Café</div><div style="font-size:13px;color:#94A3B8">🗄 3.8 GB</div>
        <div style="display:flex;gap:8px">${['#5B8DEF', '#5B8DEF', '#34D399', '#CBD5E1'].map(c => `<span style="width:30px;height:30px;border-radius:8px;background:#1B2640;display:inline-flex;align-items:center;justify-content:center;color:${c};font-size:14px">●</span>`).join('')}</div>
      </div>
    </div>
    <div class="modal-dim" style="opacity:0"></div>
    <div class="modal" style="left:310px;top:60px;width:560px;padding:28px;opacity:0">
      <div class="mA">
        <div style="font-size:21px;font-weight:700">Pair New Screen</div>
        <div class="lbl" style="margin-top:22px">Screen Name *</div><div class="ui nm" style="color:#E2E8F0"></div>
        <div style="font-size:12px;color:#64748B;margin-top:7px">Use a consistent name: CITY_Location_Number</div>
        <div class="lbl" style="margin-top:18px">Select Location (Optional)</div><div class="ui sel locv" style="color:#64748B">Select Location</div>
        <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:26px"><span class="ub ol">Cancel</span><span class="ub gen">Generate Pairing Code</span></div>
      </div>
      <div class="mB" style="display:none;text-align:center">
        <div style="font-size:21px;font-weight:700;text-align:left">Pair New Screen</div>
        <div style="font-size:14px;color:#94A3B8;margin-top:26px">Pairing code for <b style="color:#E2E8F0">PUNE_Cafe_001</b></div>
        <div style="display:flex;justify-content:center;gap:8px;margin-top:16px">${[...'K7Q2M9XA'].map((c, i) => `<span style="width:46px;height:62px;border-radius:10px;background:#1B2640;border:1px solid #3B5BA9;display:inline-flex;align-items:center;justify-content:center;font-size:30px;font-weight:800;color:#fff;${i === 4 ? 'margin-left:12px' : ''}">${c}</span>`).join('')}</div>
        <div style="font-size:14px;color:#94A3B8;margin-top:16px">Enter this code on your display</div>
        <div class="wait" style="margin-top:18px;font-size:14px;color:#93C5FD">◌ Waiting for display…</div>
      </div>
    </div>`);
  a.go('dev');
  const v = splitVenue(layer, 'cafe', 'Pune Café · TV');
  const pu = playerUI(v.tv, v.tv.offsetWidth || parseFloat(v.tv.style.width));
  v.tv.show('off');
  return {cap, a, pg, v, pu};
}, (u, s) => {
  s.cap.anim(u, .05);
  const ae = eo(P(u, .1, .6)); show(s.a, ae, `scale(${s.a.sc}) translateY(${(1 - ae) * 40}px)`);
  const ve = eo(P(u, .3, .6)); show(s.v, ve, `translateY(${(1 - ve) * 50}px)`);
  const pg = s.pg, q_ = c => pg.querySelector(c);
  q_('.pairbtn').style.transform = `scale(${clickPress(u, 1.2)})`;
  const mo = u >= 1.25 && u < 9.0, mE = eo(P(u, 1.25, .3)) * (1 - eo(P(u, 9.0, .3)));
  q_('.modal-dim').style.opacity = mE; q_('.modal').style.opacity = mE; q_('.modal').style.transform = `scale(${.95 + .05 * mE})`;
  q_('.mA').style.display = u < 4.4 ? 'block' : 'none'; q_('.mB').style.display = u >= 4.4 ? 'block' : 'none';
  if (u < 1.8) q_('.nm').innerHTML = '<span style="color:#475569">e.g. DEL_Kaushambi_001</span>'; else typeIn(q_('.nm'), 'PUNE_Cafe_001', u, 1.8, 11);
  q_('.locv').textContent = u > 3.7 ? 'Pune Café' : 'Select Location'; q_('.locv').style.color = u > 3.7 ? '#E2E8F0' : '#64748B';
  q_('.gen').style.transform = `scale(${clickPress(u, 4.3)})`;
  const paired = u >= 8.3;
  q_('.wait').innerHTML = paired ? '<span style="color:#34D399">✓ Display paired</span>' : `◌ Waiting for display${'.'.repeat(1 + ((Math.floor(u * 3) % 3) + 3) % 3)}`;
  // TV side: player pairing UI -> paired -> content
  const pin = s.pu.querySelector('.pin');
  if (u < 5.6) pin.innerHTML = '<span style="color:#475569">CODE1234</span>'; else typeIn(pin, 'K7Q2M9XA', u, 5.6, 6, true);
  s.pu.querySelector('.pbtn').style.transform = `scale(${clickPress(u, 7.8)})`;
  s.pu.style.opacity = 1 - P(u, 8.3, .25);
  const cp = P(u, 12, .6);
  s.v.tv.mix(u < 8.3 ? 'off' : 'welcome', 'breakfast', cp); if (u < 8.3) s.v.tv.glowEl.style.opacity = .2;
  s.v.tv.flash(u > 8.3 && u < 8.7 ? (1 - P(u, 8.3, .4)) * .8 : 0);
  // device card appears & goes online
  q_('.empty').style.display = u < 9.1 ? 'block' : 'none';
  rise(q_('.dcard'), u, 9.1, .45, 20); q_('.dcard').style.display = u < 9.1 ? 'none' : 'flex';
  q_('.dst').innerHTML = st(u >= 9.8); q_('.cnt').textContent = u >= 9.8 ? '1 / 1 Online' : (u >= 9.1 ? '0 / 1 Online' : '0 / 0 Online');
  q_('.dcard').style.boxShadow = u >= 9.8 && u < 11 ? `0 0 0 ${3 + 6 * P(u, 9.8, 1)}px rgba(16,185,129,${.5 * (1 - P(u, 9.8, 1.2))})` : 'none';
  CUR = [[.6, [W * .6, H * .9]], [1.1, q_('.pairbtn')], [1.2, q_('.pairbtn'), 1], [1.7, q_('.nm')], [3.4, q_('.locv')], [3.5, q_('.locv'), 1], [4.15, q_('.gen')], [4.3, q_('.gen'), 1], [7.5, s.pu.querySelector('.pbtn')], [7.8, s.pu.querySelector('.pbtn'), 1], [8.8, [W * .7, H * .95]]];
});

// ================= 6. CONTENT & PLAYLISTS =================
scene('content', layer => {
  const cap = caption(layer, {n: 2, ch: 'Content & playlists', title: 'Upload once. {grad}Play {grad}everywhere.', sub: 'Build drag-and-drop playlists from your media library.'});
  const a = app(layer, L(.84, .80)); place(a, L((W - 1440 * .84) / 2, -90), L(250, 450));
  const rows = [['breakfast', 'breakfast-menu.png', 'Morning menu · Pune Café', 'Image', '612 KB'], ['lunch', 'lunch-menu.png', 'Lunch menu · all cafés', 'Image', '598 KB'], ['dinner', 'dinner-menu.png', 'Dinner menu · all cafés', 'Image', '640 KB'], ['offer', 'weekend-offer.png', 'Cold coffee promo', 'Image', '512 KB', 1], ['welcome', 'welcome.png', 'Lobby welcome slide', 'Image', '488 KB', 1]];
  const cols = 'grid-template-columns:120px 1.6fr 1fr .7fr 60px';
  const pc = a.page('content', 'Content', 'content', `
    <div style="display:flex;gap:12px;align-items:center"><div class="ui" style="flex:1;color:#64748B">Search by title or filename...</div><div class="ui sel" style="width:170px">All Categories</div><div class="ui sel" style="width:160px">Newest First</div><span class="ub upl">⬆ Upload Media</span></div>
    <div class="uc" style="margin-top:18px;overflow:hidden"><div class="th" style="${cols}"><div>PREVIEW</div><div>TITLE &amp; DESCRIPTION</div><div>CATEGORY</div><div>SIZE</div><div></div></div>
    ${rows.map(([k, n, d, c, sz, ca]) => `<div class="tr crow" style="${cols};opacity:0">${thumb(k)}<div><div style="font-weight:600">${n}</div><div style="color:#94A3B8;font-size:13px;margin-top:3px">${d}</div><div class="bar" style="margin-top:6px;height:4px;border-radius:2px;background:#1E293B;overflow:hidden;width:220px"><div style="height:100%;width:0;background:#3B82F6"></div></div></div><div><span class="tag">${c}</span>${ca ? ' <span class="tag" style="background:rgba(245,158,11,.15);color:#FBBF24">Company Asset</span>' : ''}</div><div style="color:#CBD5E1">${sz}<div style="font-size:12px;color:#64748B">image/png</div></div><div style="color:#64748B">✎</div></div>`).join('')}</div>`);
  const item = (k, i) => `<div class="pli" data-k="${k}" style="position:absolute;left:${i * 210}px;top:0;width:190px"><div style="position:relative"><img src="${MEDIA[k]}" style="width:190px;height:107px;border-radius:10px;object-fit:cover;display:block;box-shadow:0 10px 24px rgba(0,0,0,.4)"><span class="num" style="position:absolute;left:8px;top:8px;width:26px;height:26px;border-radius:50%;background:#0c0f19cc;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center">${i + 1}</span></div></div>`;
  const pp = a.page('pl', 'Playlists', 'pl', `
    <div style="display:flex;gap:12px;align-items:center"><div class="ui" style="flex:1;color:#64748B">Search playlists...</div><div class="ui sel" style="width:170px">All Playlists</div><span class="ub">＋ Create Playlist</span></div>
    <div class="uc" style="margin-top:18px;padding:22px 24px;border-color:rgba(59,130,246,.45)">
      <div style="display:flex;justify-content:space-between"><div><div style="font-size:19px;font-weight:700">Breakfast Menu</div><div style="color:#94A3B8;font-size:14px;margin-top:4px">Morning loop · Pune Café</div></div><div style="display:flex;gap:10px;align-items:center"><span class="tag">3 Items</span><span class="tag" style="background:#1E293B;color:#CBD5E1">Used in 1 schedule</span></div></div>
      <div class="strip" style="position:relative;height:120px;margin-top:20px">${['welcome', 'breakfast', 'offer'].map(item).join('')}</div>
    </div>
    ${[['Lunch Menu', 'Midday loop · all cafés'], ['Dinner Menu', 'Evening loop · all cafés']].map(([n, d]) => `<div class="uc" style="margin-top:14px;padding:18px 24px;display:flex;justify-content:space-between;align-items:center"><div><div style="font-size:17px;font-weight:700">${n}</div><div style="color:#94A3B8;font-size:13px;margin-top:3px">${d}</div></div><div style="display:flex;gap:10px"><span class="tag">2 Items</span><span class="tag" style="background:#1E293B;color:#CBD5E1">Used in 1 schedule</span></div></div>`).join('')}`);
  a.go('content');
  let v = null; if (PORT) { v = venue(layer, 'lobby', 980, 560, {label: 'Mumbai Lobby · TV'}); place(v, 50, 1235) }
  return {cap, a, pc, pp, v};
}, (u, s) => {
  s.cap.anim(u, .05);
  const ae = eo(P(u, .1, .6)); show(s.a, ae, `scale(${s.a.sc}) translateY(${(1 - ae) * 40}px)`);
  s.pc.querySelector('.upl').style.transform = `scale(${clickPress(u, 1.0)})`;
  s.pc.querySelectorAll('.crow').forEach((r, i) => { rise(r, u, 1.6 + i * .25, .4, 16); r.querySelector('.bar div').style.width = (100 * eo(P(u, 1.7 + i * .25, .7))) + '%'; r.querySelector('.bar').style.opacity = 1 - P(u, 2.6 + i * .25, .3) });
  const onPl = u >= 6.0; s.a.go(onPl ? 'pl' : 'content', onPl ? eo(P(u, 6.0, .35)) : 1 - P(u, 5.75, .25));
  // drag 'offer' (index 2) to the front
  const d = eio(P(u, 8.5, 1.1)), lift = Math.sin(Math.PI * d);
  const pos = {welcome: lerp(0, 1, d), breakfast: lerp(1, 2, d), offer: lerp(2, 0, d)};
  s.pp.querySelectorAll('.pli').forEach(it => { const k = it.dataset.k; it.style.left = pos[k] * 210 + 'px'; it.style.zIndex = k === 'offer' ? 3 : 1; it.style.transform = k === 'offer' ? `translateY(${-lift * 26}px) scale(${1 + lift * .06}) rotate(${-lift * 3}deg)` : 'none'; it.querySelector('.num').textContent = Math.round(pos[k]) + 1 });
  if (s.v) { const ve = eo(P(u, .4, .6)); show(s.v, ve, `translateY(${(1 - ve) * 40}px)`); const seq = u < 10 ? ['welcome', 'breakfast', 'offer'] : ['offer', 'welcome', 'breakfast']; const ph = (u / 1.6) % 3, i = Math.floor(ph); s.v.tv.mix(seq[i], seq[(i + 1) % 3], clamp((ph - i - .75) / .25)) }
  const off = s.pp.querySelector('.pli[data-k="offer"]');
  CUR = [[.4, [W * .8, H * .9]], [.9, s.pc.querySelector('.upl')], [1.0, s.pc.querySelector('.upl'), 1], [2.4, [W * .7, H * .8]], [8.2, off], [8.4, off, 1], [9.6, off], [10.4, [W * .75, H * .9]]];
});

// ================= 7. DAYPARTING =================
scene('daypart', layer => {
  const cap = caption(layer, {n: 3, ch: 'Dayparting', title: 'Right content, {grad}right {grad}hour.', sub: 'Schedules switch playlists by day, weekday and hour — automatically.'});
  const v = venue(layer, 'cafe', L(940, 980), L(640, 600), {label: 'Pune Café · TV', clock: true}); place(v, L(920, 50), L(270, 470));
  const cards = [['Breakfast Menu', '06:00 AM – 11:00 AM', '#F59E0B'], ['Lunch Menu', '11:00 AM – 04:00 PM', '#10B981'], ['Dinner Menu', '04:00 PM – 10:00 PM', '#7C3AED']].map(([n, tm, c], i) => {
    const e = el(layer, `<div class="uc" style="position:absolute;padding:22px 26px;font-size:${L(19, 20)}px;transform-origin:0 50%"><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><span style="width:12px;height:12px;border-radius:3px;background:${c}"></span><b style="font-size:${L(24, 26)}px">${n}</b><span class="st on" style="font-size:13px">ACTIVE</span><span class="st" style="font-size:13px;color:#FBBF24;background:rgba(245,158,11,.12)">⚡ PRIORITY 10</span><span class="now st" style="font-size:13px;color:#fff;background:#10B981;margin-left:auto">▶ NOW PLAYING</span></div><div style="color:#CBD5E1;margin-top:12px">🕒 Every day (${tm})</div><div style="margin-top:10px"><span class="tag" style="font-size:14px">💻 PUNE_Cafe_001</span></div></div>`);
    box(e, L(80, 50), L(300 + i * 215, 1110 + i * 255), L(780, 980)); e.col = c; return e;
  });
  return {cap, v, cards};
}, (u, s) => {
  s.cap.anim(u, .05);
  const ve = eo(P(u, .1, .6)); show(s.v, ve, `translateY(${(1 - ve) * 40}px)`);
  const hrs = 7 + clamp((u - .8) / 10) * 14; s.v.setTime(hrs);
  const seg = hrs < 11 ? 0 : hrs < 16 ? 1 : 2, keys = ['breakfast', 'lunch', 'dinner'];
  const sw = [3.657, 7.229]; let p = 0, a = keys[seg], b = keys[seg];
  sw.forEach((t0, i) => { if (u >= t0 - .3 && u < t0 + .3) { a = keys[i]; b = keys[i + 1]; p = P(u, t0 - .3, .6) } });
  s.v.tv.mix(a, b, p);
  let fl = 0; sw.forEach(t0 => { if (u > t0 && u < t0 + .3) fl = (1 - P(u, t0, .3)) * .5 }); s.v.tv.flash(fl);
  s.cards.forEach((c, i) => { const e = eo(P(u, .3 + i * .15, .5)); const on = i === seg; c.style.opacity = e * (on ? 1 : .55); c.style.transform = `translateX(${(1 - e) * -60}px) scale(${on ? 1.02 : .98})`; c.style.borderColor = on ? c.col : 'rgba(148,163,184,.13)'; c.style.boxShadow = on ? `0 0 40px -10px ${c.col}` : 'none'; c.querySelector('.now').style.opacity = on ? 1 : 0 });
  const clk = el => 0;
});

// ================= 8. INSTANT UPDATE =================
scene('instant', layer => {
  const cap = caption(layer, {n: 4, ch: 'Instant updates', title: 'Hit save. {gr}Live {gr}in {gr}under {gr}2 {gr}seconds.'});
  const a = splitApp(layer);
  const pg = a.page('ed', 'Playlists', 'pl', `
    <div class="uc" style="padding:24px 26px"><div style="display:flex;justify-content:space-between;align-items:center"><div><div style="font-size:20px;font-weight:700">Today's Specials</div><div style="color:#94A3B8;font-size:14px;margin-top:4px">Playing on PUNE_Cafe_001</div></div><span class="ub save" style="padding:12px 26px;font-size:16px">Save</span></div>
      <div style="margin-top:22px;display:flex;gap:18px;align-items:center"><div class="slot" style="position:relative;width:300px;height:169px;border-radius:12px;overflow:hidden;border:2px dashed rgba(59,130,246,.6)"><img class="cur" src="${MEDIA.breakfast}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"><img class="nw" src="${MEDIA.offer}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0"></div><div style="color:#94A3B8;font-size:15px;line-height:1.6">Slot 1 · 15 s<br><span class="sname" style="color:#E2E8F0;font-weight:600">breakfast-menu.png</span></div></div>
      <div class="saved" style="margin-top:16px;font-size:15px;color:#34D399;opacity:0">✓ Saved — pushing to 1 screen</div>
    </div>
    <div style="margin-top:20px;font-size:13px;font-weight:700;letter-spacing:.1em;color:#64748B">CONTENT</div>
    <div style="display:flex;gap:16px;margin-top:12px">${['offer', 'welcome', 'lunch', 'dinner'].map(k => `<img class="lib" data-k="${k}" src="${MEDIA[k]}" style="width:190px;height:107px;border-radius:10px;object-fit:cover">`).join('')}</div>
    <img class="ghost" src="${MEDIA.offer}" style="position:absolute;width:190px;height:107px;border-radius:10px;object-fit:cover;opacity:0;box-shadow:0 20px 40px rgba(0,0,0,.6)">`);
  a.go('ed');
  const v = splitVenue(layer, 'cafe', 'Pune Café · TV');
  const lines = el(layer, `<svg class="abs" style="left:0;top:0;pointer-events:none" width="${W}" height="${H}"></svg>`);
  const ctr = el(layer, `<div class="abs" style="display:flex;align-items:baseline;gap:18px"><div class="num" style="font-size:${L(64, 72)}px;font-weight:800;font-variant-numeric:tabular-nums;letter-spacing:-.03em">0.00s</div><div style="font-size:24px;color:#94A3B8">save → on screen</div></div>`);
  box(ctr, L(80, 60), L(960, 1820));
  return {cap, a, pg, v, lines, ctr};
}, (u, s) => {
  s.cap.anim(u, .05);
  const ae = eo(P(u, .1, .6)); show(s.a, ae, `scale(${s.a.sc}) translateY(${(1 - ae) * 40}px)`);
  const ve = eo(P(u, .3, .6)); show(s.v, ve, `translateY(${(1 - ve) * 50}px)`);
  const pg = s.pg, q_ = c => pg.querySelector(c);
  // drag offer from library into slot (page coords)
  const lib = q_('.lib[data-k="offer"]'), slot = q_('.slot'), g = q_('.ghost');
  const d = eio(P(u, 2.4, .7)), x0 = lib.offsetLeft, y0 = lib.offsetTop, x1 = slot.offsetLeft + 55, y1 = slot.offsetTop + 31;
  g.style.left = lerp(x0, x1, d) + 'px'; g.style.top = lerp(y0, y1, d) + 'px'; g.style.opacity = u > 2.4 && u < 3.1 ? 1 : 0; g.style.transform = `scale(${1 + .06 * Math.sin(Math.PI * d)})`;
  q_('.nw').style.opacity = P(u, 3.0, .2); q_('.sname').textContent = u >= 3.05 ? 'weekend-offer.png' : 'breakfast-menu.png';
  q_('.save').style.transform = `scale(${clickPress(u, 4.0)})`; q_('.saved').style.opacity = eo(P(u, 4.1, .3));
  // TV swap at 5.1
  s.v.tv.mix('breakfast', 'offer', P(u, 5.05, .3)); s.v.tv.flash(u > 5.05 && u < 5.45 ? (1 - P(u, 5.05, .4)) * .8 : 0);
  s.v.tv.querySelector('.tvb').style.boxShadow = u > 5.05 && u < 6 ? `0 0 0 ${6 + 14 * P(u, 5.05, .9)}px rgba(16,185,129,${.6 * (1 - P(u, 5.05, .9))})` : '';
  // pulse from Save to TV
  const pr = P(u, 4.05, 1.0);
  if (pr > 0 && u < 6.2) { const [sx, sy] = center(q_('.save')), [tx, ty] = center(s.v.tv); const c = PORT ? `M${sx} ${sy} C ${sx} ${sy + 300}, ${tx} ${ty - 300}, ${tx} ${ty}` : `M${sx} ${sy} C ${sx + 200} ${sy}, ${tx - 200} ${ty}, ${tx} ${ty}`;
    s.lines.innerHTML = `<path d="${c}" stroke="rgba(59,130,246,.25)" stroke-width="4" fill="none"/><path d="${c}" stroke="#10B981" stroke-width="6" fill="none" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${100 - 100 * eo(pr)}" opacity="${1 - P(u, 5.6, .5)}" style="filter:drop-shadow(0 0 8px #10B981)"/>` } else s.lines.innerHTML = '';
  const sec = u < 4.0 ? 0 : Math.min(1.24, (u - 4.0) * 1.13); const num = s.ctr.querySelector('.num');
  num.textContent = sec.toFixed(2) + 's'; num.style.color = u > 5.1 ? '#10B981' : '#fff'; s.ctr.style.opacity = eo(P(u, .8, .5));
  CUR = [[1.6, [W * .55, H * .9]], [2.3, lib], [2.4, lib, 1], [3.1, slot], [3.85, q_('.save')], [4.0, q_('.save'), 1], [5.2, [W * .62, H * .85]]];
});

// ================= 9. EMERGENCY TAKEOVER =================
scene('takeover', layer => {
  const cap = caption(layer, {n: 5, ch: 'Emergency takeover', title: 'One click overrides {rd}every {rd}screen.', sub: 'Target one screen, a location, or the whole company.'});
  const sub2 = el(cap, `<div class="sub" style="position:absolute;left:0;right:0;opacity:0">…and restore the normal schedule just as fast.</div>`);
  const pw = L(780, 980);
  const panel = el(layer, `<div class="uc" style="position:absolute;padding:30px 32px;border-color:rgba(239,68,68,.45);background:linear-gradient(180deg,rgba(239,68,68,.07),#131927 40%)">
    <div style="display:flex;align-items:center;gap:12px;color:#F87171;font-weight:800;letter-spacing:.06em;font-size:20px"><svg width="26" height="26" viewBox="0 0 24 24"><path fill="#F87171" d="M1 21h22L12 2zm12-3h-2v-2h2zm0-4h-2v-4h2z"/></svg>EMERGENCY TAKEOVER OVERRIDE</div>
    <div style="color:#94A3B8;font-size:16px;margin-top:12px;line-height:1.5">Force an immediate playlist override on specific screens, locations, or company-wide. This bypasses all normal scheduling until cleared.</div>
    <div class="lbl" style="margin-top:22px">Target Scope</div><div class="ui sel sc" style="font-size:16px">Specific Screen<div class="menu m1" style="display:none"><div>Specific Screen</div><div>Location</div><div>Company-wide (All Screens)</div></div></div>
    <div class="lbl" style="margin-top:16px">Select Screen</div><div class="ui sel ss" style="font-size:16px;color:#64748B">-- Choose Screen --</div>
    <div class="lbl" style="margin-top:16px">Select Emergency Playlist</div><div class="ui sel ep" style="font-size:16px;color:#64748B">-- Choose Playlist --<div class="menu m2" style="display:none"><div>Breakfast Menu</div><div>Emergency Notice</div><div>Lunch Menu</div></div></div>
    <div class="act ub" style="margin-top:26px;width:100%;justify-content:center;height:62px;background:#EF4444;font-size:19px;font-weight:700">⚡ Activate Takeover</div>
  </div>`);
  box(panel, L(70, 50), L(270, 470), pw);
  const V = PORT ? [['cafe', 50, 1150, 980, 400, 'Pune Café', 'breakfast'], ['lobby', 50, 1570, 480, 300, 'Mumbai Lobby', 'welcome'], ['metro', 550, 1570, 480, 300, 'Delhi Metro', 'offer']]
    : [['cafe', 900, 250, 950, 390, 'Pune Café', 'breakfast'], ['lobby', 900, 660, 465, 330, 'Mumbai Lobby', 'welcome'], ['metro', 1385, 660, 465, 330, 'Delhi Metro', 'offer']];
  const vs = V.map(([ty, x, y, w, hh, lab, k]) => { const v = venue(layer, ty, w, hh, {label: lab}); place(v, x, y); v.k = k; v.tv.show(k); return v });
  return {cap, sub2, panel, vs};
}, (u, s) => {
  s.cap.anim(u, .05);
  const capSub = s.cap.querySelector('.sub'); if (u > 8.4) { capSub.style.opacity = 1 - P(u, 8.4, .3); s.sub2.style.top = capSub.offsetTop + 'px'; s.sub2.style.opacity = eo(P(u, 8.7, .4)) }
  const pe = eo(P(u, .1, .6)); show(s.panel, pe, `translateX(${(1 - pe) * -60}px)`);
  const q_ = c => s.panel.querySelector(c);
  q_('.m1').style.display = u >= 1.5 && u < 2.25 ? 'block' : 'none';
  q_('.m1').querySelectorAll('div').forEach((d, i) => d.classList.toggle('hl', i === (u < 1.9 ? 0 : 2)));
  q_('.sc').firstChild.textContent = u >= 2.25 ? 'Company-wide (All Screens)' : 'Specific Screen';
  q_('.ss').firstChild.textContent = u >= 2.25 ? 'All screens (6)' : '-- Choose Screen --'; q_('.ss').style.opacity = u >= 2.25 ? .6 : 1;
  q_('.m2').style.display = u >= 3.2 && u < 3.7 ? 'block' : 'none'; q_('.m2').querySelectorAll('div').forEach((d, i) => d.classList.toggle('hl', i === 1 && u > 3.45));
  q_('.ep').firstChild.textContent = u >= 3.7 ? 'Emergency Notice' : '-- Choose Playlist --'; q_('.ep').style.color = u >= 3.7 ? '#E2E8F0' : '#64748B';
  const btn = q_('.act'); btn.style.transform = `scale(${clickPress(u, 4.2)})`;
  const on = u >= 4.3 && u < 8.6;
  btn.style.boxShadow = u < 4.2 && u > 3.7 ? `0 0 0 ${6 + 6 * Math.sin(u * 9)}px rgba(239,68,68,.25)` : on ? `0 0 30px rgba(239,68,68,${.4 + .3 * Math.sin(u * 10)})` : 'none';
  s.vs.forEach((v, i) => {
    const e = eo(P(u, .3 + i * .1, .5)); show(v, e, `translateY(${(1 - e) * 40}px)`);
    const tOn = 4.35 + i * .1, tOff = 8.6 + i * .08;
    if (u < tOff) v.tv.mix(v.k, 'emergency', P(u, tOn, .15)); else v.tv.mix('emergency', v.k, P(u, tOff, .4));
    v.tv.flash(u > tOn && u < tOn + .25 ? .8 * (1 - P(u, tOn, .25)) : 0);
    const al = u > tOn && u < tOff; v.style.boxShadow = al ? `0 0 ${40 + 30 * Math.sin((u - tOn) * 12)}px rgba(239,68,68,.65),0 40px 90px -30px rgba(0,0,0,.9)` : '';
  });
  window.RED = on ? (.32 + .2 * Math.sin((u - 4.3) * 12)) * (1 - P(u, 8.3, .3)) : 0;
  if (u > 4.3 && u < 4.9) window.SHAKE = 14 * (1 - P(u, 4.3, .6));
  CUR = [[.9, [W * .5, H * .95]], [1.4, q_('.sc')], [1.5, q_('.sc'), 1], [2.15, q_('.m1').children[2]], [2.2, q_('.m1').children[2], 1], [3.1, q_('.ep')], [3.2, q_('.ep'), 1], [3.55, q_('.m2').children[1]], [3.6, q_('.m2').children[1], 1], [4.05, btn], [4.2, btn, 1], [5.2, [W * .45, H * .97]]];
});

// ================= 10. OFFLINE + HEALTH =================
scene('health', layer => {
  const cap = caption(layer, {n: 6, ch: 'Always on', title: 'Internet drops. {gr}Your {gr}screens {gr}don’t.', sub: 'Every screen caches its media locally, with SHA-256 integrity checks.'});
  const wifi = el(layer, `<div class="abs" style="text-align:center"><svg viewBox="0 0 24 24" width="110" height="110"><g class="arcs" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round"><path d="M2 8.5a15 15 0 0 1 20 0"/><path d="M5 12a10 10 0 0 1 14 0"/><path d="M8.5 15.5a5 5 0 0 1 7 0"/></g><circle class="dot" cx="12" cy="19" r="1.6" fill="#10B981"/><path class="x" d="M3 3 L21 21" stroke="#EF4444" stroke-width="2.4" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" fill="none"/></svg><div class="wl" style="font-size:24px;font-weight:800;letter-spacing:.15em;margin-top:6px">ONLINE</div></div>`);
  box(wifi, L(W / 2 - 150, W / 2 - 150), L(270, 520), 300);
  const V = PORT ? [['cafe', 50, 760, 980, 340, ['breakfast', 'offer']], ['lobby', 50, 1120, 980, 340, ['welcome', 'lunch']], ['metro', 50, 1480, 980, 340, ['offer', 'welcome']]]
    : [['cafe', 60, 470, 580, 400, ['breakfast', 'offer']], ['lobby', 670, 470, 580, 400, ['welcome', 'lunch']], ['metro', 1280, 470, 580, 400, ['offer', 'welcome']]];
  const vs = V.map(([ty, x, y, w, hh, seq]) => { const v = venue(layer, ty, w, hh, {label: '● Playing from cache'}); place(v, x, y); v.seq = seq; v.lab.style.color = '#34D399'; v.lab.style.opacity = 0; return v });
  const sha = el(layer, `<div class="abs" style="left:0;right:0;text-align:center"><span class="pill" style="background:rgba(16,185,129,.16);color:#34D399;font-size:${L(26, 28)}px">✓ SHA-256 integrity-checked · Offline-ready 24/7</span></div>`); sha.style.top = L(920, 1860) - 20 + 'px';
  // health modal (rebuilt from the real "Device Health" modal)
  const tile = (ic, l, v, s2, cls) => `<div class="uc" style="padding:16px 18px;background:#0f1522"><div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:#94A3B8">${ic} ${l}</div><div class="${cls || ''}" style="font-size:28px;font-weight:700;margin-top:8px">${v}</div><div style="font-size:12px;color:#64748B;margin-top:2px">${s2}</div></div>`;
  const kv = r => r.map(([k, v]) => `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px"><span style="color:#94A3B8">${k}</span><span>${v}</span></div>`).join('');
  const hm = el(layer, `<div class="modal" style="width:560px;padding:24px 26px;transform-origin:0 0">
    <div style="display:flex;justify-content:space-between"><div><div style="font-size:21px;font-weight:700">Device Health</div><div style="font-size:13px;color:#94A3B8;margin-top:3px">PUNE_Cafe_001 · ${st(true)}</div></div><span style="color:#94A3B8">✕</span></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px">${tile('◔', 'CPU UTILIZATION', '18%', 'System Load', 'cpu')}${tile('▦', 'MEMORY USAGE', '41%', 'Active RAM', 'mem')}${tile('☰', 'STORAGE AVAILABLE', '3.8 GB', 'of 5.8 GB')}${tile('▮', 'BATTERY LEVEL', '100%', 'Charging')}</div>
    <div class="uc" style="padding:12px 16px;margin-top:12px;background:#0f1522"><div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:#94A3B8;margin-bottom:4px">HARDWARE &amp; DISPLAY</div>${kv([['Manufacturer', 'Google'], ['Model', 'Chromecast HD'], ['Android Version', 'Android 12 (SDK 31)'], ['Display', '1920 × 1080']])}</div>
    <div class="uc" style="padding:12px 16px;margin-top:12px;background:#0f1522"><div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:#94A3B8;margin-bottom:4px">SYSTEM INFO</div>${kv([['App Version', '1.3.1+20'], ['Last Check-in', 'Just now'], ['Screen ID', '7f3a9c…c21e']])}</div>
    <div class="uc" style="padding:12px 16px;margin-top:12px;background:#0f1522;height:118px;overflow:hidden"><div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:#94A3B8;margin-bottom:6px">↻ RECENT HEARTBEATS</div><div class="hb"></div></div>
    <div style="display:flex;justify-content:flex-end;margin-top:16px"><span class="ub ol">Close Monitor</span></div></div>`);
  const hs = L(1.0, 1.55); hm.sc = hs; hm.style.left = L(1180, (W - 560 * hs) / 2) + 'px'; hm.style.top = L(135, 470) + 'px';
  const cap2 = el(layer, `<div class="abs" style="${PORT ? 'left:0;right:0;text-align:center;top:150px;padding:0 50px' : 'left:120px;top:380px;width:900px'}"><div class="chip-ch"><b>6</b>Device health</div><div class="h2" style="margin-top:18px;font-size:${L(66, 66)}px">${wordsHTML('Health of every screen, {grad}from {grad}your {grad}desk.')}</div><div class="sub" style="margin-top:16px">CPU, memory, storage, app version and live heartbeats — plus remote refresh and restart.</div></div>`);
  return {cap, wifi, vs, sha, hm, cap2};
}, (u, s) => {
  const out = eio(P(u, 5.7, .5));
  s.cap.anim(u, .05); s.cap.style.opacity = 1 - out;
  const we = back(P(u, .2, .5)); show(s.wifi, clamp(we) * (1 - out), `scale(${clamp(we, 0, 1.2)})`);
  const off = u >= 1.6; s.wifi.querySelector('.x').style.strokeDashoffset = 100 - 100 * eo(P(u, 1.6, .3));
  const col = off ? '#475569' : '#10B981'; s.wifi.querySelector('.arcs').setAttribute('stroke', col); s.wifi.querySelector('.dot').setAttribute('fill', col);
  const wl = s.wifi.querySelector('.wl'); wl.textContent = off ? 'OFFLINE' : 'ONLINE'; wl.style.color = off ? '#F87171' : '#34D399';
  if (u > 1.6 && u < 1.85) window.SHAKE = 5;
  s.vs.forEach((v, i) => { const e = eo(P(u, .3 + i * .1, .5)); show(v, e * (1 - out), `translateY(${(1 - e) * 40}px) scale(${1 - out * .08})`);
    const ph = ((u + i * .6) / 1.8) % 2, k = Math.floor(ph); v.tv.mix(v.seq[k], v.seq[1 - k], clamp((ph - k - .8) / .2)); v.lab.style.opacity = off ? eo(P(u, 2.0 + i * .15, .4)) : 0 });
  const se = back(P(u, 3.6, .45)); s.sha.style.opacity = clamp(se) * (1 - out); s.sha.style.transform = `scale(${.9 + .1 * se})`;
  // health modal
  const he = spring(P(u, 6.0, 1) * 1.6); s.hm.style.opacity = clamp(P(u, 6.0, .3)); s.hm.style.transform = `scale(${s.hm.sc * (.92 + .08 * he)}) translateY(${(1 - he) * 40}px)`;
  s.hm.querySelector('.cpu').textContent = Math.round(18 + 5 * Math.sin(u * 2.3)) + '%'; s.hm.querySelector('.mem').textContent = Math.round(41 + 2 * Math.sin(u * 1.3)) + '%';
  const n = Math.floor(u - 5.5); let rows = ''; for (let i = 0; i < 5; i++) { const k = n - i, sec = 5 + k; rows += `<div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;color:${i === 0 ? '#E2E8F0' : '#94A3B8'}"><span>10:42:${String(sec * 5 % 60).padStart(2, '0')}</span><span>CPU ${16 + (k * 7) % 9}%</span><span>Bat 100%</span><span>PSS ${208 + (k * 13) % 20} MB</span></div>` }
  s.hm.querySelector('.hb').innerHTML = rows;
  const c2 = s.cap2; c2.style.opacity = eo(P(u, 6.1, .5)); wordsIn(c2.querySelector('.h2'), u, 6.2, .06, .5);
});

// ================= 11. OVERLAYS & TEAM =================
scene('overlays', layer => {
  const cap = caption(layer, {n: 7, ch: 'Display overlays', title: 'Your brand, {grad}on {grad}every {grad}screen.', sub: 'A logo watermark and a scrolling ticker on all displays.'});
  const cb = (cls, l, sub) => `<div style="display:flex;justify-content:space-between;align-items:flex-start"><div><div style="font-weight:700;font-size:16px">${l}</div><div style="font-size:13px;color:#94A3B8;margin-top:4px">${sub}</div></div><span class="${cls}" style="width:24px;height:24px;border-radius:6px;border:2px solid #475569;display:inline-flex;align-items:center;justify-content:center;font-size:15px;color:#fff"></span></div>`;
  const panel = el(layer, `<div class="uc" style="position:absolute;padding:28px 30px">
    <div style="font-size:21px;font-weight:700">Display Overlays</div><div style="font-size:14px;color:#94A3B8;margin-top:6px;line-height:1.5">Configure persistent logo bug watermark and scrolling ticker announcements broadcasted to all active displays.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px">
      <div class="uc" style="padding:18px;background:#0f1522">${cb('c1', 'Logo Bug Overlay', 'Render logo watermark on displays')}<div class="lbl" style="margin-top:16px">Logo Screen Corner Position</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${['Top Left', 'Top Right', 'Bottom Left', 'Bottom Right'].map(p => `<div class="ui" style="justify-content:center;font-size:13px;min-height:38px;${p === 'Top Right' ? 'border-color:#3B82F6;color:#93C5FD' : ''}">${p === 'Top Right' ? '✓ ' : ''}${p}</div>`).join('')}</div></div>
      <div class="uc" style="padding:18px;background:#0f1522">${cb('c2', 'Text Ticker Overlay', 'Broadcast scrolling text on displays')}<div class="lbl" style="margin-top:16px">Ticker Message Text</div><div class="ui tk" style="font-size:13px;min-height:64px;align-items:flex-start;line-height:1.4"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px"><div><div class="lbl">Position</div><div class="ui sel" style="font-size:13px;min-height:38px">Bottom Bar</div></div><div><div class="lbl">Crawl Speed</div><div class="ui sel" style="font-size:13px;min-height:38px">Medium</div></div></div></div>
    </div>
    <div style="display:flex;justify-content:flex-end;margin-top:18px"><span class="ub">💾 Save Profile</span></div></div>`);
  box(panel, L(70, 50), L(270, 470), L(800, 980));
  const v = venue(layer, 'lobby', L(930, 980), L(620, 560), {label: 'Mumbai Lobby · TV'}); place(v, L(920, 50), L(290, 1250)); v.tv.show('welcome');
  const tvw = parseFloat(v.tv.style.width);
  const bug = el(v.tv.ov, `<div class="abs" style="right:3%;top:5%;padding:${tvw * .008}px ${tvw * .016}px;border-radius:${tvw * .01}px;background:rgba(255,255,255,.92);color:#1E3A8A;font-weight:800;font-size:${tvw * .022}px;opacity:0">☕ SETU CAFÉ</div>`);
  const tick = el(v.tv.ov, `<div class="abs" style="left:0;right:0;bottom:0;height:11%;background:rgba(10,15,30,.88);overflow:hidden;opacity:0"><div class="tx" style="position:absolute;white-space:nowrap;top:50%;transform:translateY(-50%);color:#fff;font-weight:600;font-size:${tvw * .03}px"></div></div>`);
  const team = el(layer, `<div class="abs" style="left:0;right:0;text-align:center"><span class="pill" style="background:rgba(59,130,246,.14);color:#93C5FD;font-size:${L(24, 26)}px">👥 Add teammates with role-based access</span></div>`); team.style.top = L(990, 1840) - 20 + 'px';
  return {cap, panel, v, bug, tick, team};
}, (u, s) => {
  s.cap.anim(u, .05);
  const pe = eo(P(u, .1, .6)); show(s.panel, pe, `translateX(${(1 - pe) * -60}px)`);
  const ve = eo(P(u, .3, .6)); show(s.v, ve, `translateY(${(1 - ve) * 40}px)`);
  const c1 = s.panel.querySelector('.c1'), c2 = s.panel.querySelector('.c2');
  [[c1, 1.2], [c2, 2.6]].forEach(([c, t0]) => { const on = u >= t0; c.style.background = on ? '#3B82F6' : 'transparent'; c.style.borderColor = on ? '#3B82F6' : '#475569'; c.textContent = on ? '✓' : '' });
  const msg = "Today's special: Masala Dosa ₹140  ·  Free Wi-Fi  ·  Open till 10 PM  ·  ";
  typeIn(s.panel.querySelector('.tk'), msg.trim(), u, 3.0, 22);
  s.bug.style.opacity = eo(P(u, 2.0, .4)); s.bug.style.transform = `scale(${.8 + .2 * back(P(u, 2.0, .4))})`;
  s.tick.style.opacity = eo(P(u, 3.2, .4)); const tx = s.tick.querySelector('.tx'); tx.textContent = msg + msg + msg;
  tx.style.left = (100 - (u - 3.2) * 9) + '%';
  s.team.style.opacity = eo(P(u, 6.0, .5)); s.team.style.transform = `translateY(${(1 - eo(P(u, 6.0, .5))) * 20}px)`;
  CUR = [[.6, [W * .5, H * .9]], [1.1, c1], [1.2, c1, 1], [2.5, c2], [2.6, c2, 1], [3.4, [W * .45, H * .95]]];
});

// ================= 12. HARDWARE + PRICING =================
scene('pricing', layer => {
  const hw = el(layer, `<div class="abs" style="inset:0"></div>`);
  const hcap = caption(hw, {title: 'Runs on screens {grad}you {grad}already {grad}own.', sub: 'Android 8.0+ · or Samsung Tizen with no download', ly: 150, py: 360, size: L(70, 72)});
  const ic = {and: '<svg viewBox="0 0 24 24"><path fill="#34D399" d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8m17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5m-4.97-5.84 1.3-1.3c.2-.2.2-.51 0-.71s-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0s-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84M10 5H9V4h1zm5 0h-1V4h1z"/></svg>', tv: `<svg viewBox="0 0 24 24"><path fill="#5B8DEF" d="${'M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2m0 14H3V5h18z'}"/></svg>`, stick: '<svg viewBox="0 0 24 24"><path fill="#FBBF24" d="M3 9h13l5 3-5 3H3z"/></svg>'};
  const chips = [['and', 'Android TV'], ['tv', 'Google TV'], ['stick', 'HDMI player sticks'], ['tv', 'Samsung Tizen']].map(([k, l], i) => { const c = el(hw, `<div class="chip">${ic[k]}${l}</div>`); box(c, PORT ? 140 : [360, 1000, 360, 1000][i], PORT ? 720 + i * 170 : [480, 480, 650, 650][i]); if (PORT) c.style.width = '800px'; else c.style.width = '560px'; return c });
  const pr = el(layer, `<div class="abs" style="inset:0"></div>`);
  const pt = el(pr, `<div class="cap" style="top:${L(170, 420)}px;padding:0 40px"><div class="eyebrow">Simple, transparent pricing</div><div style="font-size:${L(140, 120)}px;font-weight:800;letter-spacing:-.05em;margin-top:18px;line-height:1">Plans from <span class="bl">₹799</span><span style="font-size:.45em;color:#94A3B8">/mo</span></div><div class="sub" style="margin-top:22px">Billed annually · Free to start · No credit card</div></div>`);
  const plans = [['BASIC', '5 screens', '₹799/mo'], ['PRO', '20 screens', '₹2,399/mo', 1], ['MAX', '50 screens', 'Contact us'], ['ULTRA', 'Custom', 'Contact us']].map(([n, sc, p, pop_], i) => { const c = el(pr, `<div class="uc" style="position:absolute;padding:26px 26px;text-align:left;${pop_ ? 'border-color:#3B82F6;box-shadow:0 0 50px -12px #3B82F6' : ''}">${pop_ ? '<div style="position:absolute;top:-14px;left:22px;font-size:12px;font-weight:800;letter-spacing:.08em;background:#3B82F6;padding:4px 10px;border-radius:6px">MOST POPULAR</div>' : ''}<div style="font-size:18px;font-weight:800;letter-spacing:.06em;color:#93C5FD">${n}</div><div style="font-size:34px;font-weight:800;margin-top:10px">${sc}</div><div style="font-size:20px;color:#94A3B8;margin-top:6px">${p}</div></div>`); box(c, PORT ? [50, 550, 50, 550][i] : 190 + i * 395, PORT ? [1060, 1060, 1300, 1300][i] : 600, PORT ? 480 : 365); return c });
  return {hw, hcap, chips, pr, pt, plans};
}, (u, s, e) => {
  const o1 = e.off >= 3.7 ? 0 : 1 - eio(P(u, 3.7, .4)); s.hw.style.opacity = o1; s.hw.style.display = o1 > 0 ? 'block' : 'none';
  s.hcap.anim(u, .05);
  s.chips.forEach((c, i) => { const a = .6 + i * .22, e = back(P(u, a, .5)); c.style.opacity = clamp(P(u, a, .2)); c.style.transform = `translateY(${(1 - clamp(e)) * 60}px) scale(${.8 + .2 * e})` });
  s.pr.style.display = u > 3.8 ? 'block' : 'none';
  const pe = eo(P(u, 4.0, .6)); show(s.pt, pe, `scale(${.92 + .08 * pe})`);
  s.plans.forEach((c, i) => rise(c, u, 4.5 + i * .12, .5, 40));
});

// ================= 13. CTA =================
scene('cta', layer => {
  const logo = el(layer, `<div class="abs" style="left:0;right:0;display:flex;justify-content:center;align-items:center;gap:30px;${PORT ? 'flex-direction:column;gap:20px' : ''}"><svg width="150" height="125" viewBox="0 0 120 100"><rect x="12" y="10" width="96" height="58" rx="5" fill="url(#lg)"/><rect x="6" y="4" width="108" height="70" rx="8" fill="none" stroke="#3B82F6" stroke-width="7"/><path d="M60 76 V88 M40 88 H80" stroke="#3B82F6" stroke-width="8" stroke-linecap="round" fill="none"/></svg><div style="font-size:${L(120, 116)}px;font-weight:800;letter-spacing:-.04em">Screen<span class="bl">Setu</span></div></div>`); logo.style.top = L(240, 470) + 'px';
  const tag = el(layer, `<div class="cap" style="top:${L(460, 870)}px;font-size:${L(44, 46)}px;font-weight:700;color:#CBD5E1;letter-spacing:-.02em;padding:0 60px">Every screen in your business, under your control.</div>`);
  const btn = el(layer, `<div class="abs ub" style="justify-content:center;font-size:42px;border-radius:20px;font-weight:800">Get started free</div>`); box(btn, (W - 500) / 2, L(580, 1100), 500, 110);
  const sm = el(layer, `<div class="cap" style="top:${L(730, 1260)}px;font-size:28px;color:#94A3B8">Free to start · No credit card · Set up in minutes</div>`);
  const url = el(layer, `<div class="cap" style="top:${L(820, 1380)}px;font-size:${L(66, 72)}px;font-weight:800;letter-spacing:-.02em"><span class="grad">screensetu.com</span></div>`);
  return {logo, tag, btn, sm, url};
}, (u, s) => {
  const le = spring(P(u, 0, 1.2) * 1.6); show(s.logo, clamp(P(u, 0, .4)), `scale(${.8 + .2 * le})`);
  rise(s.tag, u, .7, .5, 20);
  const be = back(P(u, 1.2, .5)), pulse = u > 1.8 ? Math.sin((u - 1.8) * 4) : 0, ring = u > 1.8 ? ((u - 1.8) % 1.2) / 1.2 : 0;
  s.btn.style.opacity = clamp(be); s.btn.style.transform = `scale(${clamp(be, 0, 1.1) * (1 + .03 * Math.max(0, pulse))})`;
  s.btn.style.boxShadow = u > 1.8 ? `0 0 0 ${ring * 40}px rgba(59,130,246,${.5 * (1 - ring)}),0 30px 60px -20px rgba(59,130,246,.7)` : 'none';
  rise(s.sm, u, 1.7, .5, 16); rise(s.url, u, 2.1, .6, 24);
});
