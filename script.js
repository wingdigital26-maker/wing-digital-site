/* Wing Digital shared behavior */

/* nav solid state */
const nav = document.getElementById('nav');
const hero = document.querySelector('.hero');
const solidAt = () => (hero ? window.innerHeight * 0.85 : 120);
addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > solidAt()));
addEventListener('load', () => nav.classList.toggle('solid', scrollY > solidAt()));

/* mobile menu */
const burger = document.querySelector('.burger');
if (burger) burger.addEventListener('click', () => {
  const open = nav.classList.toggle('menu-open');
  burger.setAttribute('aria-expanded', open);
});

/* contact form: show thanks after formsubmit redirect */
if (location.search.includes('sent=1')) {
  const l = document.getElementById('subL');
  if (l) l.textContent = "Thanks — we'll be in touch!";
}

/* intro overlay (home only) — chip dissolves into the wordmark */
const intro = document.getElementById('intro');
if (intro) {
  const wm = document.querySelector('.wordmark');
  if (wm) wm.classList.add('wm-hide');
  requestAnimationFrame(() => intro.classList.add('show'));
  setTimeout(() => {
    intro.classList.add('open');          // sigil charges, flashes, panes crack apart
  }, 1500);
  setTimeout(() => {
    const w = document.querySelector('.wordmark');
    if (w) w.classList.remove('wm-hide'); // wordmark eases in on the flash
  }, 2050);
  setTimeout(() => intro.remove(), 3400);
}

/* cursor glow on dark zones */
(function () {
  const zones = [...document.querySelectorAll('.darkzone')].map(zone => {
    const layer = zone.querySelector('.glowlayer');
    return layer ? { zone, layer, tx: 50, ty: 28, cx: 50, cy: 28 } : null;
  }).filter(Boolean);
  if (!zones.length) return;
  zones.forEach(z => {
    z.zone.addEventListener('pointermove', e => {
      const r = z.zone.getBoundingClientRect();
      z.tx = ((e.clientX - r.left) / r.width) * 100;
      z.ty = ((e.clientY - r.top) / r.height) * 100;
    });
  });
  (function loop() {
    zones.forEach(z => {
      z.cx += (z.tx - z.cx) * 0.09; z.cy += (z.ty - z.cy) * 0.09;
      z.layer.style.setProperty('--gx', z.cx.toFixed(2) + '%');
      z.layer.style.setProperty('--gy', z.cy.toFixed(2) + '%');
    });
    requestAnimationFrame(loop);
  })();
})();

/* lightbox for screenshots */
(function () {
  const shots = document.querySelectorAll('.frame--wide img');
  if (!shots.length) return;
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<img alt="">';
  document.body.appendChild(lb);
  const big = lb.querySelector('img');
  shots.forEach(img => img.parentElement.addEventListener('click', () => {
    big.src = img.src; big.alt = img.alt; lb.classList.add('on');
  }));
  lb.addEventListener('click', () => lb.classList.remove('on'));
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('on'); });
})();

/* service selector (home) */
const ARW = ' <svg viewBox="0 0 24 24" fill="none" style="width:15px;height:15px;vertical-align:-2px"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const svc = {
  web: '<b>SERVICE 01 — Website Design.</b> A site that turns visitors into customers, live in two weeks. <a href="website-design.html">See the service' + ARW + '</a>',
  seo: '<b>SERVICE 02 — Local SEO.</b> Show up when customers search for what you do. <a href="local-seo.html">See the service' + ARW + '</a>',
  social: '<b>SERVICE 03 — Social Media.</b> A professional presence, handled for you. <a href="social-media.html">See the service' + ARW + '</a>',
  email: '<b>SERVICE 04 — Lead Generation.</b> Outreach that finds the work, follow-up that never lets a lead go cold. <a href="lead-generation.html">See the service' + ARW + '</a>'
};
const segBody = document.getElementById('segBody');
if (segBody) document.querySelectorAll('.seg button').forEach(b => b.onclick = () => {
  document.querySelectorAll('.seg button').forEach(x => x.classList.remove('on'));
  b.classList.add('on'); segBody.style.opacity = 0;
  setTimeout(() => { segBody.innerHTML = svc[b.dataset.k]; segBody.style.opacity = 1; }, 160);
});

/* faq accordion */
document.querySelectorAll('.qa').forEach(qa => {
  const btn = qa.querySelector('button'), ans = qa.querySelector('.ans');
  btn.onclick = () => {
    const open = qa.classList.contains('open');
    document.querySelectorAll('.qa').forEach(o => { o.classList.remove('open'); o.querySelector('.ans').style.maxHeight = null; });
    if (!open) { qa.classList.add('open'); ans.style.maxHeight = ans.scrollHeight + 'px'; }
  };
});

/* scroll reveal: ONLY the first section below the fold animates.
   Everything further down is static, so the page does not keep re-animating. */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  if (e.target.id === 'bars') runBars();
  if (e.target.dataset.stats !== undefined) runCounts(e.target);
  io.unobserve(e.target);
}), { threshold: .16 });

/* ONE reveal moment: only the first couple of elements you meet on the way down
   animate. Everything past that is static. Hover motion is untouched. */
const rvAll = [...document.querySelectorAll('.rv')];
const ANIMATE_FIRST = 2;
rvAll.forEach((el, i) => {
  if (i < ANIMATE_FIRST) io.observe(el);   // animates once, on first scroll
  else el.classList.add('in');             // static from here down
});
/* counters/bars fill once when reached, then stay put */
document.querySelectorAll('[data-stats]').forEach(el => io.observe(el));
const barsEl = document.getElementById('bars');
if (barsEl) io.observe(barsEl);

function runBars() {
  document.querySelectorAll('.fill').forEach(f => f.style.width = f.dataset.w + '%');
  document.querySelectorAll('.bar-top .p').forEach(p => {
    let n = 0, to = +p.dataset.to, s = Math.max(1, Math.round(to / 38));
    const t = setInterval(() => { n += s; if (n >= to) { n = to; clearInterval(t); } p.textContent = n + '%'; }, 26);
  });
}
function runCounts(scope) {
  scope.querySelectorAll('.stat .num').forEach(el => {
    const to = +el.dataset.count, pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    const disp = el.querySelector('span'); const t0 = performance.now();
    function f(t) { const p = Math.min(1, (t - t0) / 1100); disp.textContent = pre + Math.round(to * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  });
}

/* contact form */
function submitForm(e) {
  e.preventDefault();
  const l = document.getElementById('subL');
  if (l) l.textContent = "Thanks — we'll be in touch!";
  e.target.reset(); return false;
}
window.submitForm = submitForm;

/* animated page-head backgrounds: aurora | particles | waves | grid */
(function () {
  const cv = document.querySelector('canvas.bghead');
  if (!cv) return;
  const mode = cv.dataset.bg, ctx = cv.getContext('2d');
  let W, H, t = 0, mx = .5, my = .35;
  function size() { const r = cv.parentElement.getBoundingClientRect(); W = cv.width = r.width; H = cv.height = r.height; }
  size(); addEventListener('resize', size);
  cv.parentElement.addEventListener('pointermove', e => {
    const r = cv.parentElement.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height;
  });
  const dots = Array.from({ length: 70 }, () => ({
    x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .0007, vy: (Math.random() - .5) * .0007
  }));
  function aurora() {
    ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
    const blobs = [
      [.5 + .34 * Math.sin(t * .0005) + (mx - .5) * .16, .34 + .22 * Math.cos(t * .0004), 'rgba(39,87,230,.34)', .42],
      [.28 + .2 * Math.cos(t * .00034), .6 + .2 * Math.sin(t * .00045) + (my - .5) * .14, 'rgba(120,80,255,.26)', .36],
      [.76 + .16 * Math.sin(t * .00042), .5 + .24 * Math.cos(t * .00052), 'rgba(30,180,240,.2)', .4]
    ];
    blobs.forEach(([x, y, c, r]) => {
      const g = ctx.createRadialGradient(x * W, y * H, 0, x * W, y * H, r * W);
      g.addColorStop(0, c); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    });
    ctx.globalCompositeOperation = 'source-over';
  }
  function particles() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      d.x += d.vx + (mx - d.x) * .00035; d.y += d.vy + (my - d.y) * .00035;
      if (d.x < 0 || d.x > 1) d.vx *= -1; if (d.y < 0 || d.y > 1) d.vy *= -1;
    });
    ctx.strokeStyle = 'rgba(61,107,240,.16)'; ctx.lineWidth = 1;
    for (let i = 0; i < dots.length; i++) for (let j = i + 1; j < dots.length; j++) {
      const a = dots[i], b = dots[j], dx = (a.x - b.x) * W, dy = (a.y - b.y) * H, d2 = dx * dx + dy * dy;
      if (d2 < 13000) { ctx.beginPath(); ctx.moveTo(a.x * W, a.y * H); ctx.lineTo(b.x * W, b.y * H); ctx.stroke(); }
    }
    ctx.fillStyle = 'rgba(120,150,250,.75)';
    dots.forEach(d => { ctx.beginPath(); ctx.arc(d.x * W, d.y * H, 1.8, 0, 7); ctx.fill(); });
  }
  function waves() {
    ctx.clearRect(0, 0, W, H);
    for (let l = 0; l < 5; l++) {
      ctx.beginPath();
      const amp = 22 + l * 16, yb = H * (.3 + l * .14), sp = .0006 + l * .00012;
      for (let x = 0; x <= W; x += 6) {
        const y = yb + Math.sin(x * .006 + t * sp + l * 1.7) * amp
          + Math.sin(x * .0023 + t * sp * 1.6) * amp * .5 + (my - .5) * 40;
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      const g = ctx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, 'rgba(39,87,230,' + (.26 - l * .04) + ')');
      g.addColorStop(.55, 'rgba(120,90,255,' + (.3 - l * .045) + ')');
      g.addColorStop(1, 'rgba(30,180,240,' + (.22 - l * .035) + ')');
      ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.stroke();
    }
  }
  function grid() {
    ctx.clearRect(0, 0, W, H);
    const gap = 34;
    for (let gx = gap / 2; gx < W; gx += gap) for (let gy = gap / 2; gy < H; gy += gap) {
      const dx = gx / W - mx, dy = gy / H - my;
      const near = Math.max(0, 1 - Math.hypot(dx, dy) * 2.4);
      const wave = (Math.sin(gx * .012 + t * .0012) + Math.cos(gy * .014 - t * .0009)) * .25 + .5;
      const a = .06 + wave * .1 + near * .5;
      const r = 1.1 + wave * .9 + near * 2.2;
      ctx.fillStyle = 'rgba(' + (near > .25 ? '120,160,255' : '70,110,235') + ',' + a.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(gx, gy + Math.sin(gx * .01 + t * .001) * 6, r, 0, 7); ctx.fill();
    }
  }
  const fn = { aurora, particles, waves, grid }[mode] || aurora;
  (function loop() { t += 16.7; fn(); requestAnimationFrame(loop); })();
})();
