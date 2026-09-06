/* Wing Digital entity: Halo.
 * Floating orb with counter-rotating orbit rings and a blinking lens.
 * Self-contained interactive SVG component. No dependencies.
 * Usage:
 *   <script src="/mascot/wing-mascot.js"></script>
 *   var m = WingMascot.mount(document.getElementById('slot'), { size: 120, intro: true });
 *   m.setState('calm' | 'excited' | 'alert' | 'dim');
 * Behavior: levitates with a breathing glow, blinks its lens on a random timer,
 * rings spin up on hover/tap, brief flare on fast scroll. Honors
 * prefers-reduced-motion (static pose, no timers).
 */
(function () {
  var SVG = '<svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true" style="overflow:visible">' +
    '<defs>' +
    '<radialGradient id="wmCore" cx="42%" cy="34%" r="75%">' +
    '<stop offset="0%" stop-color="#9db4ff"/><stop offset="45%" stop-color="#2757E6"/><stop offset="100%" stop-color="#12245e"/>' +
    '</radialGradient>' +
    '<radialGradient id="wmHalo" cx="50%" cy="50%" r="50%">' +
    '<stop offset="0%" stop-color="#2757E6" stop-opacity=".55"/><stop offset="100%" stop-color="#2757E6" stop-opacity="0"/>' +
    '</radialGradient>' +
    '</defs>' +
    '<g class="wm-rig">' +
    '<circle class="wm-glow" cx="100" cy="96" r="74" fill="url(#wmHalo)"/>' +
    '<circle class="wm-core" cx="100" cy="96" r="40" fill="url(#wmCore)"/>' +
    '<g class="wm-eyes">' +
    '<g class="wm-eye-open"><rect x="84" y="82" width="11" height="24" rx="5.5" fill="#eaf0ff"/><rect x="105" y="82" width="11" height="24" rx="5.5" fill="#eaf0ff"/></g>' +
    '<g class="wm-eye-happy" opacity="0"><path d="M84 98 q5.5 -9 11 0" fill="none" stroke="#eaf0ff" stroke-width="5" stroke-linecap="round"/><path d="M105 98 q5.5 -9 11 0" fill="none" stroke="#eaf0ff" stroke-width="5" stroke-linecap="round"/></g>' +
    '</g>' +
    '<g class="wm-ring wm-r1">' +
    '<ellipse cx="100" cy="96" rx="62" ry="20" fill="none" stroke="#7d9bff" stroke-width="1.4" opacity=".55" transform="rotate(-18 100 96)"/>' +
    '<circle cx="162" cy="96" r="4" fill="#c9d6ff" transform="rotate(-18 100 96)"/>' +
    '</g>' +
    '<g class="wm-ring wm-r2">' +
    '<ellipse cx="100" cy="96" rx="56" ry="26" fill="none" stroke="#2757E6" stroke-width="1.2" opacity=".5" transform="rotate(24 100 96)"/>' +
    '<circle cx="44" cy="96" r="3" fill="#7d9bff" transform="rotate(24 100 96)"/>' +
    '</g>' +
    '</g></svg>';

  var CSS = '.wm-root{display:inline-block;line-height:0}' +
    '.wm-rig{transform-origin:100px 96px;animation:wm-float 4.2s ease-in-out infinite}' +
    '@keyframes wm-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}' +
    '.wm-glow{transform-origin:100px 96px;animation:wm-pulse 3.2s ease-in-out infinite}' +
    '@keyframes wm-pulse{0%,100%{opacity:.55}50%{opacity:1}}' +
    '.wm-core{transition:filter .4s}' +
    '.wm-eyes{transform-origin:100px 94px;animation:wm-look 11s ease-in-out infinite}' +
    '@keyframes wm-look{0%,26%,100%{transform:translateX(0)}30%,44%{transform:translateX(-5px)}48%,62%{transform:translateX(4px)}66%{transform:translateX(0)}}' +
    '.wm-eye-open{transform-origin:100px 94px;transition:opacity .15s}' +
    '.wm-eye-happy{transition:opacity .15s}' +
    '.wm-eyes.wm-blink .wm-eye-open{animation:wm-blinkk .3s linear}' +
    '@keyframes wm-blinkk{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.06)}}' +
    '.wm-root:hover .wm-eye-open,.wm-excited .wm-eye-open{opacity:0}' +
    '.wm-root:hover .wm-eye-happy,.wm-excited .wm-eye-happy{opacity:1}' +
    '.wm-ring{transform-origin:100px 96px;animation:wm-orbit 9s linear infinite}' +
    '.wm-r2{animation-duration:14s;animation-direction:reverse}' +
    '@keyframes wm-orbit{to{transform:rotate(360deg)}}' +
    '.wm-root:hover .wm-ring,.wm-excited .wm-ring{animation-duration:2.2s}' +
    '.wm-root:hover .wm-r2,.wm-excited .wm-r2{animation-duration:3.4s}' +
    '.wm-root:hover .wm-core,.wm-excited .wm-core{filter:brightness(1.25)}' +
    '.wm-dim .wm-core{filter:brightness(.7) saturate(.6)}' +
    '.wm-dim .wm-glow{animation-duration:6s;opacity:.3}' +
    '.wm-alert .wm-core{filter:brightness(1.15) hue-rotate(160deg) saturate(1.6)}' +
    '.wm-alert .wm-glow{animation-duration:1.1s}' +
    '.wm-flare .wm-glow{animation:wm-flarek .6s ease-out}' +
    '@keyframes wm-flarek{0%{opacity:1;transform:scale(1)}40%{opacity:1;transform:scale(1.25)}100%{opacity:.55;transform:scale(1)}}' +
    '.wm-intro{animation:wm-arrive 1.6s cubic-bezier(.22,.9,.3,1) both}' +
    '@keyframes wm-arrive{0%{transform:translateY(-36px) scale(.5);opacity:0}60%{opacity:1}100%{transform:none;opacity:1}}' +
    '@media (prefers-reduced-motion:reduce){.wm-rig,.wm-glow,.wm-eyes,.wm-eye-open,.wm-ring,.wm-intro,.wm-flare .wm-glow{animation:none !important}}';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var styleInjected = false;

  function mount(el, opts) {
    opts = opts || {};
    if (!styleInjected) {
      var s = document.createElement('style');
      s.textContent = CSS;
      document.head.appendChild(s);
      styleInjected = true;
    }
    var root = document.createElement('span');
    root.className = 'wm-root' + (opts.intro && !reduced ? ' wm-intro' : '');
    root.style.width = (opts.size || 96) + 'px';
    root.style.height = (opts.size || 96) + 'px';
    root.innerHTML = SVG;
    root.setAttribute('role', 'img');
    root.setAttribute('aria-label', 'Zephyr, the Wing Digital assistant');
    el.appendChild(root);

    var eyes = root.querySelector('.wm-eyes');

    function blink() {
      if (reduced) return;
      eyes.classList.add('wm-blink');
      setTimeout(function () { eyes.classList.remove('wm-blink'); }, 320);
    }
    function flare() {
      if (reduced) return;
      root.classList.add('wm-flare');
      setTimeout(function () { root.classList.remove('wm-flare'); }, 650);
    }
    function setState(state) {
      root.classList.remove('wm-excited', 'wm-alert', 'wm-dim');
      if (state === 'excited') root.classList.add('wm-excited');
      if (state === 'alert') root.classList.add('wm-alert');
      if (state === 'dim') root.classList.add('wm-dim');
    }

    root.addEventListener('click', flare);

    if (!reduced) {
      (function blinkLoop() {
        setTimeout(function () { blink(); blinkLoop(); }, 2600 + Math.random() * 4200);
      })();
      if (opts.intro) setTimeout(flare, 1700);
      /* eyes follow the cursor; idle look-around resumes after 3s still */
      var idleTimer = null, raf = 0, mx = 0, my = 0;
      function track() {
        raf = 0;
        var r = root.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height * 0.46;
        var dx = mx - cx, dy = my - cy;
        var d = Math.sqrt(dx * dx + dy * dy) || 1;
        var m = Math.min(d / 40, 1);
        eyes.style.animation = 'none';
        eyes.style.transform = 'translate(' + (dx / d * 6 * m).toFixed(1) + 'px,' + (dy / d * 4 * m).toFixed(1) + 'px)';
        clearTimeout(idleTimer);
        idleTimer = setTimeout(function () {
          eyes.style.transform = '';
          eyes.style.animation = '';
        }, 3000);
      }
      window.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        if (!raf) raf = requestAnimationFrame(track);
      }, { passive: true });
      var lastY = window.scrollY, busy = false;
      window.addEventListener('scroll', function () {
        var dy = Math.abs(window.scrollY - lastY);
        lastY = window.scrollY;
        if (dy > 240 && !busy) {
          busy = true;
          flare();
          setTimeout(function () { busy = false; }, 900);
        }
      }, { passive: true });
    }
    return { blink: blink, flare: flare, setState: setState, el: root };
  }

  window.WingMascot = { mount: mount };
})();

/* Halo assistant panel: a guided, scripted Q&A that makes the entity feel
 * like an AI you can talk to. No backend needed; swap answerFn for a real
 * API route later without touching the UI. */
(function () {
  var PANEL_CSS = '.wmp{position:fixed;right:18px;bottom:96px;z-index:70;width:min(320px,calc(100vw - 36px));' +
    'background:rgba(11,12,16,.92);backdrop-filter:blur(10px);border:1px solid rgba(125,155,255,.35);' +
    'border-radius:16px;box-shadow:0 12px 48px rgba(39,87,230,.35);color:#eaf0ff;' +
    'font-family:Inter,system-ui,sans-serif;font-size:14px;overflow:hidden;' +
    'opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity .3s,transform .3s}' +
    '.wmp.open{opacity:1;transform:none;pointer-events:auto}' +
    '.wmp-head{display:flex;align-items:center;gap:9px;padding:12px 14px;border-bottom:1px solid rgba(125,155,255,.2)}' +
    '.wmp-head b{font-weight:600}' +
    '.wmp-head .dot{width:8px;height:8px;border-radius:50%;background:#7d9bff;box-shadow:0 0 8px #7d9bff;animation:wmpulse 2s infinite}' +
    '@keyframes wmpulse{50%{opacity:.4}}' +
    '.wmp-x{margin-left:auto;background:none;border:0;color:#8fa3d8;font-size:16px;cursor:pointer;padding:2px 6px}' +
    '.wmp-body{padding:14px;min-height:72px;line-height:1.55;color:#c9d6ff}' +
    '.wmp-body a{color:#9db4ff}' +
    '.wmp-q{display:flex;flex-direction:column;gap:7px;padding:0 14px 14px}' +
    '.wmp-q button{text-align:left;background:rgba(39,87,230,.16);border:1px solid rgba(125,155,255,.3);' +
    'color:#eaf0ff;border-radius:10px;padding:9px 12px;font:inherit;cursor:pointer;transition:background .15s}' +
    '.wmp-q button:hover{background:rgba(39,87,230,.34)}' +
    '@media(prefers-reduced-motion:reduce){.wmp{transition:none}.wmp-head .dot{animation:none}}';

  function attachChat(mascot, opts) {
    var s = document.createElement('style');
    s.textContent = PANEL_CSS;
    document.head.appendChild(s);
    var p = document.createElement('div');
    p.className = 'wmp';
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-label', 'Halo assistant');
    p.innerHTML = '<div class="wmp-head"><span class="dot"></span><b>Zephyr</b>' +
      '<span style="color:#8fa3d8;font-size:12px">Wing Digital</span>' +
      '<button class="wmp-x" aria-label="Close">&times;</button></div>' +
      '<div class="wmp-body"></div><div class="wmp-q"></div>';
    document.body.appendChild(p);
    var body = p.querySelector('.wmp-body');
    var qwrap = p.querySelector('.wmp-q');
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var typeTimer = null;

    function say(html) {
      clearInterval(typeTimer);
      if (reduced) { body.innerHTML = html; return; }
      var tmp = document.createElement('div');
      tmp.innerHTML = html;
      var full = tmp.textContent, i = 0;
      body.textContent = '';
      typeTimer = setInterval(function () {
        i += 2;
        body.textContent = full.slice(0, i);
        if (i >= full.length) { clearInterval(typeTimer); body.innerHTML = html; }
      }, 14);
    }
    function renderQuestions() {
      qwrap.innerHTML = '';
      (opts.items || []).forEach(function (item) {
        var b = document.createElement('button');
        b.textContent = item.q;
        b.addEventListener('click', function () {
          mascot.flare();
          say(item.a);
        });
        qwrap.appendChild(b);
      });
    }
    function toggle(force) {
      var open = typeof force === 'boolean' ? force : !p.classList.contains('open');
      p.classList.toggle('open', open);
      if (open) { mascot.flare(); say(opts.greeting || 'Hey, I am Zephyr. What do you want to know?'); renderQuestions(); }
    }
    p.querySelector('.wmp-x').addEventListener('click', function () { toggle(false); });
    mascot.el.addEventListener('click', function () { toggle(); });
    mascot.el.style.cursor = 'pointer';
    return { toggle: toggle, say: say };
  }
  if (window.WingMascot) window.WingMascot.chat = attachChat;
})();
