// 💓 Heartbeat — a heart monitor whose pulse writes "I love you". Made by @hack.n.code
(() => {
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const CAPTURE = params.has('capture');

  // "I love you" as ONE continuous pulse line (single-stroke cursive, x 0..1, y up)
  const TEXT = [[0.0935, 0.0], [0.0791, 0.0144], [0.0647, 0.036], [0.0576, 0.0504], [0.0504, 0.072], [0.0504, 0.0936], [0.0576, 0.1079], [0.0647, 0.1151], [0.0791, 0.1151], [0.0863, 0.1079], [0.0935, 0.0936], [0.0935, 0.072], [0.0863, 0.036], [0.0719, 0.0], [0.0647, -0.0144], [0.0504, -0.0287], [0.036, -0.0359], [0.0216, -0.0359], [0.0072, -0.0287], [0.0, -0.0144], [0.0, 0.0], [0.0072, 0.0072], [0.0216, 0.0072], [0.036, 0.0], [0.2302, 0.0], [0.2446, 0.0216], [0.2662, 0.0576], [0.2734, 0.072], [0.2806, 0.0936], [0.2806, 0.1079], [0.2734, 0.1151], [0.259, 0.1079], [0.2518, 0.0936], [0.2446, 0.0648], [0.2374, 0.0144], [0.2374, -0.0287], [0.2446, -0.0359], [0.2518, -0.0359], [0.2662, -0.0287], [0.2734, -0.0215], [0.2878, 0.0], [0.3309, 0.0288], [0.3165, 0.0288], [0.3022, 0.0216], [0.295, 0.0144], [0.2878, 0.0], [0.2878, -0.0144], [0.295, -0.0287], [0.3094, -0.0359], [0.3237, -0.0359], [0.3381, -0.0287], [0.3453, -0.0215], [0.3525, -0.0072], [0.3525, 0.0072], [0.3453, 0.0216], [0.3309, 0.0288], [0.3237, 0.0216], [0.3237, 0.0072], [0.3309, -0.0072], [0.3453, -0.0144], [0.3669, -0.0144], [0.3813, -0.0072], [0.3885, 0.0], [0.4029, 0.0288], [0.3957, -0.0072], [0.3957, -0.0287], [0.4029, -0.0359], [0.4101, -0.0359], [0.4317, -0.0287], [0.446, -0.0144], [0.4532, 0.0072], [0.4532, 0.0288], [0.4604, 0.0], [0.4676, -0.0072], [0.482, -0.0072], [0.4964, 0.0], [0.5036, -0.0215], [0.518, -0.0144], [0.5252, -0.0072], [0.5324, 0.0072], [0.5324, 0.0216], [0.5252, 0.0288], [0.518, 0.0288], [0.5036, 0.0216], [0.4964, 0.0072], [0.4964, -0.0144], [0.5036, -0.0287], [0.518, -0.0359], [0.5324, -0.0359], [0.5468, -0.0287], [0.554, -0.0215], [0.5683, 0.0], [0.6835, 0.0], [0.6978, 0.0288], [0.6835, -0.0144], [0.6835, -0.0287], [0.6906, -0.0359], [0.705, -0.0359], [0.7194, -0.0287], [0.7338, -0.0144], [0.7482, 0.0072], [0.7554, 0.0288], [0.7122, -0.1007], [0.705, -0.1151], [0.6906, -0.1223], [0.6835, -0.1151], [0.6835, -0.1007], [0.6906, -0.0791], [0.7122, -0.0575], [0.7338, -0.0431], [0.7482, -0.0359], [0.7698, -0.0215], [0.7914, 0.0], [0.8345, 0.0288], [0.8201, 0.0288], [0.8058, 0.0216], [0.7986, 0.0144], [0.7914, 0.0], [0.7914, -0.0144], [0.7986, -0.0287], [0.8129, -0.0359], [0.8273, -0.0359], [0.8417, -0.0287], [0.8489, -0.0215], [0.8561, -0.0072], [0.8561, 0.0072], [0.8489, 0.0216], [0.8345, 0.0288], [0.8273, 0.0216], [0.8273, 0.0072], [0.8345, -0.0072], [0.8489, -0.0144], [0.8705, -0.0144], [0.8849, -0.0072], [0.8921, 0.0], [0.9065, 0.0288], [0.8921, -0.0144], [0.8921, -0.0287], [0.8993, -0.0359], [0.9137, -0.0359], [0.9281, -0.0287], [0.9424, -0.0144], [0.9568, 0.0072], [0.964, 0.0288], [0.9496, -0.0144], [0.9496, -0.0287], [0.9568, -0.0359], [0.964, -0.0359], [0.9784, -0.0287], [0.9856, -0.0215], [1.0, 0.0]];

  // ---------- timeline (seconds after Start) ----------
  const D = 8.0;                       // BPM ramps 72 -> 143 over D seconds
  const WIPE0 = 2.6, WRITE0 = 3.0, WRITE1 = 6.4, MORPH0 = 6.9, MORPH1 = 8.1, DONE = 8.2;
  const SPEED = 170;                   // sweep speed, px per second

  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ramp = (t, a, b) => cl((t - a) / (b - a));
  const smooth = (x) => { x = cl(x); return x * x * (3 - 2 * x); };
  const eio = (x) => { x = cl(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const frac = (x) => x - Math.floor(x);

  // heart rate after Start, and the beat count (integral of rate) so beats stay in sync
  const bpmAt = (u) => 72 + 71 * smooth(u / D);
  function integ(u) { if (u <= 0) return 0; if (u < D) { const x = u / D; return D * (x * x * x - x * x * x * x / 2); } return D * 0.5 + (u - D); }
  const runPhase = (u) => (72 * u + 71 * integ(u)) / 60;
  function phaseAt(tau, g0, started) { return (!started || tau <= g0) ? 1.2 * tau : 1.2 * g0 + runPhase(tau - g0); }

  // one ECG beat (P, QRS, T) — f is the position inside the beat, R peak at 0.3
  const g = (f, c, s) => Math.exp(-((f - c) / s) * ((f - c) / s));
  const ecg = (f) => 0.12 * g(f, .13, .035) - 0.14 * g(f, .272, .011) + g(f, .3, .016) - 0.28 * g(f, .328, .012) + 0.24 * g(f, .56, .055);

  // ---------- state ----------
  const S = { phase: 'idle', t: 0, it: 0, g0: 0, name: '' };
  const input = $('name');
  if (params.get('name')) { input.value = params.get('name').slice(0, 18); S.name = input.value; }

  // ---------- canvas ----------
  const cv = $('mon'), cx = cv.getContext('2d');
  let cw = 0, ch = 0, dpr = 1, WP = null, HP = null;
  function resize() {
    const r = cv.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 3);
    cw = r.width; ch = r.height; cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr);
    buildPaths();
  }
  function resample(P, N) {
    const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const tot = L[L.length - 1], out = []; let j = 0;
    for (let k = 0; k < N; k++) { const d = tot * k / (N - 1); while (j < P.length - 2 && L[j + 1] < d) j++;
      const s = (d - L[j]) / ((L[j + 1] - L[j]) || 1); out.push([P[j][0] + (P[j + 1][0] - P[j][0]) * s, P[j][1] + (P[j + 1][1] - P[j][1]) * s]); }
    return out;
  }
  const midY = () => ch * 0.42;
  function heartGeom() { const hs = Math.min(cw * 0.56 / 32, ch * 0.5 / 29); return { hs, cy: ch * 0.36 }; }
  function heartPt(t, hs, cy, k = 1) { const x = 16 * Math.pow(Math.sin(t), 3); const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return [cw / 2 + x * hs * k, cy - (y + 2.5) * hs * k]; }
  function buildPaths() {
    const N = 900, s = cw * 0.9, left = cw * 0.045, my = midY();
    const spike = (x0, w, amp) => { const o = []; for (let i = 0; i <= 24; i++) { const f = 0.2 + 0.2 * i / 24; o.push([x0 + w * (i / 24), my - ecg(f) * amp]); } return o; };
    const P = [[0, my]];
    const tx = (p) => [left + p[0] * s, my - p[1] * s];
    const first = tx(TEXT[0]);
    P.push(...spike(first[0] * 0.25, first[0] * 0.5, ch * 0.18));
    TEXT.forEach((p) => P.push(tx(p)));
    const last = tx(TEXT[TEXT.length - 1]);
    P.push(...spike(last[0] + (cw - last[0]) * 0.2, (cw - last[0]) * 0.6, ch * 0.18));
    P.push([cw, my]);
    WP = resample(P, N);
    const { hs, cy } = heartGeom(); const H = [];
    for (let i = 0; i <= 600; i++) H.push(heartPt(-Math.PI + 2 * Math.PI * i / 600, hs, cy));
    HP = resample(H, N);
  }

  function grid() {
    cx.save(); cx.lineWidth = 1;
    for (let x = 0; x <= cw; x += 18) { cx.strokeStyle = (Math.round(x / 18) % 5 === 0) ? 'rgba(57,255,136,.10)' : 'rgba(57,255,136,.04)'; cx.beginPath(); cx.moveTo(x + .5, 0); cx.lineTo(x + .5, ch); cx.stroke(); }
    for (let y = 0; y <= ch; y += 18) { cx.strokeStyle = (Math.round(y / 18) % 5 === 0) ? 'rgba(57,255,136,.10)' : 'rgba(57,255,136,.04)'; cx.beginPath(); cx.moveTo(0, y + .5); cx.lineTo(cw, y + .5); cx.stroke(); }
    cx.restore();
  }
  function glowLine(pts, color, width, glow, alpha = 1) {
    if (pts.length < 2) return;
    cx.save(); cx.globalAlpha = alpha; cx.lineJoin = 'round'; cx.lineCap = 'round';
    cx.beginPath(); cx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) cx.lineTo(pts[i][0], pts[i][1]);
    cx.strokeStyle = color; cx.shadowColor = color; cx.shadowBlur = glow; cx.lineWidth = width * 2.6; cx.globalAlpha = alpha * 0.25; cx.stroke();
    cx.globalAlpha = alpha; cx.shadowBlur = glow * 0.6; cx.lineWidth = width; cx.stroke();
    cx.shadowBlur = 0; cx.strokeStyle = 'rgba(255,255,255,.75)'; cx.lineWidth = width * 0.35; cx.stroke();
    cx.restore();
  }
  function dot(x, y, color, r) { cx.save(); cx.fillStyle = '#fff'; cx.shadowColor = color; cx.shadowBlur = 22; cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.fill(); cx.restore(); }

  function drawSweep(G, started, alpha) {
    const my = midY(), A = ch * 0.27, head = ((G * SPEED) % cw + cw) % cw, GAP = 30;
    const segs = [];
    const pt = (x) => { const age = ((head - x) % cw + cw) % cw; const tau = G - age / SPEED; return [x, my - ecg(frac(phaseAt(tau, S.g0, started))) * A, age]; };
    // newest part (left of head) and older part (right of the gap)
    const a = []; for (let x = 0; x <= head; x += 0.75) a.push(pt(x)); a.push(pt(head));
    const b = []; for (let x = head + GAP; x <= cw; x += 0.75) b.push(pt(x));
    const draw = (arr) => { for (let i = 0; i < arr.length; i += 40) { const seg = arr.slice(i, i + 41); const age = seg[0][2]; glowLine(seg, '#39ff88', 2.6, 14, alpha * (1 - 0.65 * age / cw)); } };
    draw(b); draw(a);
    if (alpha > 0.05) { const h = pt(head); dot(h[0], h[1], '#39ff88', 3.6 * alpha); }
  }
  function lerpC(a, b, k) { return `rgb(${Math.round(a[0] + (b[0] - a[0]) * k)},${Math.round(a[1] + (b[1] - a[1]) * k)},${Math.round(a[2] + (b[2] - a[2]) * k)})`; }
  const GREEN = [57, 255, 136], PINK = [255, 45, 111];

  function miniHeart(x, y, r, a) { cx.save(); cx.globalAlpha = a; cx.fillStyle = '#ff5c8f'; cx.shadowColor = '#ff2d6f'; cx.shadowBlur = 10; cx.beginPath();
    for (let i = 0; i <= 40; i++) { const t = -Math.PI + 2 * Math.PI * i / 40; const hx = 16 * Math.pow(Math.sin(t), 3), hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const px = x + hx * r / 16, py = y - hy * r / 16; i ? cx.lineTo(px, py) : cx.moveTo(px, py); } cx.fill(); cx.restore(); }

  function drawHeart(t, beatF, morphK) {
    const { hs, cy } = heartGeom();
    const since = frac(beatF - 0.3);              // 0 right at a beat
    const pulse = 1 + 0.085 * Math.exp(-since * 7) + 0.03 * Math.exp(-Math.abs(since - 0.22) * 18);
    const k = morphK < 1 ? 1 : pulse;
    // floating mini hearts
    if (morphK >= 1) {
      const tt = t - MORPH1;
      for (let i = 0; i < 16; i++) { const sx = frac(Math.sin(i * 91.7) * 4375.5), sp = 30 + 40 * frac(Math.sin(i * 13.1) * 917.3);
        const life = (tt * sp / ch + frac(Math.sin(i * 7.7) * 311.1)); const y = ch * (1 - frac(life)) ; const a = Math.min(1, tt * 1.5) * 0.55 * Math.sin(Math.PI * frac(life));
        miniHeart(sx * cw, y, 5 + 6 * frac(Math.sin(i * 3.3) * 77.7), a); }
    }
    // pulse line entering and leaving the heart
    const L = heartPt(-Math.PI / 2, hs, cy, k), R = heartPt(Math.PI / 2, hs, cy, k);
    const amp = hs * (3.2 + 2.2 * Math.exp(-since * 6));
    const side = (x0, x1, y) => { const o = []; const n = 60; for (let i = 0; i <= n; i++) { const u = i / n; const x = x0 + (x1 - x0) * u; const f = 0.18 + 0.24 * cl((u - 0.25) / 0.5); o.push([x, y - ecg(f) * amp * (u > .25 && u < .75 ? 1 : 0)]); } return o; };
    const sideA = cl((t - MORPH1 + 0.2) / 0.6);
    if (sideA > 0) { glowLine(side(0, L[0] - 4, L[1]), '#ff2d6f', 2.4, 14, sideA * 0.9); glowLine(side(cw, R[0] + 4, R[1]), '#ff2d6f', 2.4, 14, sideA * 0.9); }
    // the heart itself
    const pts = [];
    for (let i = 0; i <= 300; i++) pts.push(heartPt(-Math.PI + 2 * Math.PI * i / 300, hs, cy, k));
    cx.save(); cx.beginPath(); pts.forEach((p, i) => i ? cx.lineTo(p[0], p[1]) : cx.moveTo(p[0], p[1])); cx.closePath();
    const gr = cx.createRadialGradient(cw / 2, cy - hs * 2, hs * 2, cw / 2, cy, hs * 18);
    gr.addColorStop(0, `rgba(255,92,143,${0.55 + 0.25 * Math.exp(-since * 6)})`); gr.addColorStop(1, 'rgba(160,0,50,.15)');
    cx.fillStyle = gr; cx.globalAlpha = cl((t - MORPH1 + 0.3) / 0.6); cx.shadowColor = '#ff2d6f'; cx.shadowBlur = 40 * pulse; cx.fill(); cx.restore();
    glowLine(pts, '#ff2d6f', 4, 26, 1);
    // little ECG drawn inside the heart
    const inner = []; const n = 120; const w = hs * 18;
    for (let i = 0; i <= n; i++) { const u = i / n; const f = 0.15 + 0.3 * u; inner.push([cw / 2 - w / 2 + w * u, cy - hs * 1.2 - ecg(f) * hs * 7 * k]); }
    glowLine(inner, '#ffffff', 2.2, 14, cl((t - MORPH1) / 0.5) * 0.9);
  }

  function drawWriting(t) {
    const N = WP.length;
    const p = eio(ramp(t, WRITE0, WRITE1));
    const m = eio(ramp(t, MORPH0, MORPH1));
    const n = Math.max(2, Math.floor(p * (N - 1)) + 1);
    const pts = [];
    for (let i = 0; i < n; i++) { const a = WP[i], b = HP[i]; const bend = Math.sin(Math.PI * m) * 18 * Math.sin(i / N * Math.PI * 2);
      pts.push([a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m + bend]); }
    const col = lerpC(GREEN, PINK, m);
    const glowBoost = 1 + 0.6 * ramp(t, WRITE1, MORPH0) * (1 - m);
    glowLine(pts, col, 3.2 * glowBoost, 18 * glowBoost, 1);
    if (p < 1) { const h = pts[pts.length - 1]; dot(h[0], h[1], '#39ff88', 5); }
  }

  // ---------- render (pure function of S, so it can be recorded frame by frame) ----------
  let lastName = null;
  function render() {
    const started = S.phase !== 'idle';
    const t = started ? S.t : 0;
    const G = started ? S.g0 + t : S.it;
    const beatF = phaseAt(G, S.g0, started);
    const nm = (S.name || '').trim();

    cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, cw, ch); grid();
    if (!started || t < WRITE0) drawSweep(G, started, started ? 1 - ramp(t, WIPE0, WRITE0) : 1);
    if (started && t >= WRITE0 && t < MORPH1) drawWriting(t);
    if (started && t >= MORPH1 - 0.001) drawHeart(t, beatF, 1);

    // vitals
    const bpm = !started ? 72 : (t >= DONE ? 143 : Math.round(bpmAt(t)));
    $('bpm').textContent = bpm;
    $('hrBox').classList.toggle('love', started && t > 6.2);
    const since = frac(beatF - 0.3);
    $('ht').style.transform = `scale(${1 + 0.5 * Math.exp(-since * 9)})`;
    $('rec').style.opacity = frac(G) < 0.5 ? 1 : 0.25;
    $('lovePct').textContent = !started ? 'LOW' : (t >= DONE ? '∞' : Math.min(100, Math.round(12 + 88 * ramp(t, 0, MORPH1))) + '%');
    if (nm !== lastName) { $('pname').textContent = nm || 'For you'; lastName = nm;
      if (nm) { $('m1').textContent = 'My heart beats for you,'; $('m2').textContent = nm; } else { $('m1').textContent = 'My heart beats'; $('m2').textContent = 'for you ❤'; } }
    // status line
    const st = $('status'); let txt = 'NORMAL SINUS RHYTHM', cls = '';
    if (started) {
      if (t < WIPE0) { txt = `⚠ HR RISING · ${(nm || 'YOU').toUpperCase()} DETECTED`; cls = 'warn'; }
      else if (t < WRITE1 + 0.3) { txt = '⚠ THE PULSE IS WRITING SOMETHING…'; cls = 'warn'; }
      else if (t < DONE) { txt = '⚠ RHYTHM IS TURNING INTO…'; cls = 'warn'; }
      else { txt = 'DIAGNOSIS: IN LOVE ❤'; cls = 'love'; }
    }
    $('stTxt').textContent = txt; st.className = cls;
    // message + buttons
    const mo = started ? smooth(ramp(t, DONE, DONE + 0.7)) : 0;
    $('msg').style.opacity = mo; $('msg').style.transform = `translateY(${(1 - mo) * 14}px)`;
    const ao = started ? smooth(ramp(t, DONE + 0.2, DONE + 0.6)) : 0;
    document.body.classList.toggle('done', ao > 0.5);
    $('form').style.opacity = 1 - ao; $('form').style.transform = `translateY(${-10 * ao}px)`;
    $('after').style.opacity = ao; $('after').style.transform = `translateY(${10 * (1 - ao)}px)`;
    const c = new Date(); $('clock').textContent = CAPTURE ? '7:30 PM' : c.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  // ---------- sound (live only): a soft monitor beep on every beat ----------
  let ac = null, muted = false;
  function beep(love) {
    if (!ac || muted) return; const o = ac.createOscillator(), gn = ac.createGain(); const t0 = ac.currentTime;
    o.type = 'sine'; o.frequency.value = love ? 880 : 1046; gn.gain.setValueAtTime(0, t0); gn.gain.linearRampToValueAtTime(0.13, t0 + 0.008); gn.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.14);
    o.connect(gn).connect(ac.destination); o.start(t0); o.stop(t0 + 0.16);
  }

  // ---------- live controller ----------
  const T0 = performance.now(); let runStart = 0, lastBeat = null;
  function start() {
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); } catch (e) {}
    S.name = input.value.trim(); input.blur();
    S.g0 = (performance.now() - T0) / 1000; S.phase = 'run'; S.t = 0; runStart = performance.now();
    $('go').classList.add('press'); setTimeout(() => $('go').classList.remove('press'), 150);
    const u = new URL(location.href); if (S.name) u.searchParams.set('name', S.name); else u.searchParams.delete('name'); history.replaceState(null, '', u);
  }
  function loop(now) {
    S.it = (now - T0) / 1000;
    if (S.phase !== 'idle') { S.t = (now - runStart) / 1000; if (S.t >= DONE) S.phase = 'done'; }
    const G = S.phase === 'idle' ? S.it : S.g0 + S.t;
    const b = Math.floor(phaseAt(G, S.g0, S.phase !== 'idle') - 0.3);
    if (lastBeat !== null && b > lastBeat) beep(S.phase === 'done');
    lastBeat = b;
    render(); requestAnimationFrame(loop);
  }
  input.addEventListener('input', () => { if (S.phase === 'idle') S.name = input.value; });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') start(); });
  $('go').addEventListener('click', start);
  $('replay').addEventListener('click', start);
  function toast(msg) { const el = $('toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('on'), 1800); }
  async function share() {
    const u = new URL(location.origin + location.pathname);
    const nm = (S.phase === 'idle' ? input.value : S.name).trim(); if (nm) u.searchParams.set('name', nm);
    const data = { title: 'Heartbeat 💓', text: 'My heart monitor wrote something for you… open it with sound on 💓', url: u.toString() };
    try { if (navigator.share) { await navigator.share(data); return; } await navigator.clipboard.writeText(data.url); toast('Link copied! Send it 💌'); }
    catch (e) { if (e && e.name !== 'AbortError') prompt('Copy this link:', data.url); }
  }
  $('share').addEventListener('click', share); $('share2').addEventListener('click', share);
  $('gate').addEventListener('click', () => { $('gate').classList.remove('on'); start(); });

  // ---------- capture hooks (used to record the reel frame by frame) ----------
  window.__render = (st) => {
    Object.assign(S, st);
    if (st.typed !== undefined) input.value = st.typed;
    const c = $('caret');
    if (st.caret) { c.style.display = 'block'; const m = document.createElement('span'); m.style.cssText = 'visibility:hidden;position:absolute;white-space:pre;font:' + getComputedStyle(input).font; m.textContent = input.value; document.body.appendChild(m);
      c.style.left = (parseFloat(getComputedStyle(input).paddingLeft) + m.offsetWidth + 2) + 'px'; m.remove(); } else c.style.display = 'none';
    $('go').classList.toggle('press', !!st.press);
    render();
  };
  window.__rect = (id) => { const r = $(id).getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; };
  window.__beat = (st) => { const s = Object.assign({}, S, st); const started = s.phase !== 'idle'; const G = started ? s.g0 + s.t : s.it; return phaseAt(G, s.g0, started); };
  window.__T = { WIPE0, WRITE0, WRITE1, MORPH0, MORPH1, DONE };

  window.addEventListener('resize', () => { resize(); render(); });
  resize(); render();
  if (CAPTURE) document.fonts.ready.then(() => { resize(); render(); setTimeout(() => { window.__ready = true; }, 300); });
  else {
    document.fonts.ready.then(() => { resize(); });
    if (params.get('name')) { $('gateTxt').textContent = `${params.get('name').slice(0, 18)}, someone's heart is beating for you`; $('gate').classList.add('on'); }
    requestAnimationFrame(loop);
  }
})();
