/* Wing Digital — the opening.
 *
 * The idea: the site's whole argument is that a presence is a network, and the
 * hero background is that network. So the intro IS the network. Points fly in
 * from the dark, assemble into the wordmark, hold, then scatter outward and
 * hand you the hero, where the same points are still drifting.
 *
 * The wordmark is not an image and not a font render sitting on top. The
 * letterforms are sampled off an offscreen canvas and become the particle
 * targets, so the type is literally built out of the network.
 *
 * ~2.4s, skipped entirely under prefers-reduced-motion.
 */
(function () {
  'use strict';

  var host = document.getElementById('intro');
  if (!host) return;

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED) { host.classList.add('done'); return; }

  var ACCENT = '61,107,240';
  var PAPER = '250,249,246';

  var cv = document.createElement('canvas');
  cv.className = 'introcv';
  host.appendChild(cv);
  var c = cv.getContext('2d');

  var w, h, dpr, pts = [], t0 = 0, raf = 0, done = false;

  /* sample the wordmark into a set of target points */
  function buildTargets() {
    var size = Math.min(Math.max(w * 0.135, 46), 168);
    var off = document.createElement('canvas');
    off.width = w; off.height = h;
    var o = off.getContext('2d');
    o.fillStyle = '#fff';
    o.textAlign = 'center';
    o.textBaseline = 'middle';
    o.font = '400 ' + size + 'px "Fraunces", Georgia, serif';
    o.fillText('Wing Digital', w / 2, h / 2);

    var img = o.getImageData(0, 0, w, h).data;
    var step = size < 70 ? 3 : 4;
    var targets = [];
    for (var y = 0; y < h; y += step) {
      for (var x = 0; x < w; x += step) {
        if (img[(y * w + x) * 4 + 3] > 110) {
          targets.push({ x: x + (Math.random() - 0.5) * 0.9,
                         y: y + (Math.random() - 0.5) * 0.9 });
        }
      }
    }
    return targets;
  }

  function size() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = window.innerWidth; h = window.innerHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    cv.style.width = w + 'px'; cv.style.height = h + 'px';
    c.setTransform(dpr, 0, 0, dpr, 0, 0);

    var targets = buildTargets();
    // cap the particle count so a wide monitor does not melt
    var max = 2800;
    if (targets.length > max) {
      var keep = [], stride = targets.length / max;
      for (var i = 0; i < max; i++) keep.push(targets[Math.floor(i * stride)]);
      targets = keep;
    }

    pts = targets.map(function (t) {
      var ang = Math.random() * Math.PI * 2;
      var rad = Math.max(w, h) * (0.55 + Math.random() * 0.6);
      return {
        tx: t.x, ty: t.y,
        x: w / 2 + Math.cos(ang) * rad,
        y: h / 2 + Math.sin(ang) * rad,
        // dispersal vector, reused at the end
        dx: Math.cos(ang), dy: Math.sin(ang),
        d: 0.055 + Math.random() * 0.05,      // ease rate, staggers arrival
        r: 1.05 + Math.random() * 1.0
      };
    });
  }

  function easeOut(k) { return 1 - Math.pow(1 - k, 3); }

  function frame(now) {
    if (!t0) t0 = now;
    var t = (now - t0) / 1000;
    c.clearRect(0, 0, w, h);

    // phase: 0 assemble (0 - 1.05), 1 hold (1.05 - 1.65), 2 scatter (1.65 - 2.4)
    var scatter = t > 1.85 ? easeOut(Math.min(1, (t - 1.85) / 0.75)) : 0;
    var settle = Math.min(1, t / 1.05);
    var i, p, a, b, d;

    for (i = 0; i < pts.length; i++) {
      p = pts[i];
      p.x += (p.tx - p.x) * p.d;
      p.y += (p.ty - p.y) * p.d;
    }

    // links, only once the shape has begun to read and only to near neighbours
    if (settle > 0.45 && scatter < 0.5) {
      var linkA = Math.min(1, (settle - 0.45) / 0.55) * (1 - scatter * 2);
      c.lineWidth = 1;
      for (i = 0; i < pts.length; i += 3) {
        a = pts[i];
        for (var j = i + 3; j < i + 30 && j < pts.length; j += 3) {
          b = pts[j];
          d = (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
          if (d > 900) continue;
          c.strokeStyle = 'rgba(' + ACCENT + ',' + (0.5 * linkA * (1 - d / 900)).toFixed(3) + ')';
          c.beginPath();
          c.moveTo(a.x + p_off(a, scatter, 0), a.y + p_off(a, scatter, 1));
          c.lineTo(b.x + p_off(b, scatter, 0), b.y + p_off(b, scatter, 1));
          c.stroke();
        }
      }
    }

    for (i = 0; i < pts.length; i++) {
      p = pts[i];
      var ox = p_off(p, scatter, 0), oy = p_off(p, scatter, 1);
      var alpha = (0.35 + settle * 0.6) * (1 - scatter);
      // a few points carry the accent so the mark reads as lit, not printed
      c.fillStyle = (i % 11 === 0)
        ? 'rgba(' + ACCENT + ',' + (alpha * 1.1).toFixed(3) + ')'
        : 'rgba(' + PAPER + ',' + alpha.toFixed(3) + ')';
      c.beginPath();
      c.arc(p.x + ox, p.y + oy, p.r * (1 - scatter * 0.5), 0, 6.284);
      c.fill();
    }

    if (t > 2.1) host.classList.add('lift');       // panel fades with the scatter
    if (t > 2.65) { finish(); return; }
    raf = requestAnimationFrame(frame);
  }

  function p_off(p, scatter, axis) {
    if (!scatter) return 0;
    var m = scatter * Math.max(w, h) * 0.55;
    return (axis === 0 ? p.dx : p.dy) * m;
  }

  function finish() {
    if (done) return;
    done = true;
    if (raf) cancelAnimationFrame(raf);
    host.classList.add('done');
  }

  function start() {
    size();
    host.classList.add('open');
    raf = requestAnimationFrame(frame);
    // safety net: never trap the page behind the intro
    setTimeout(finish, 3400);
  }

  if (document.fonts && document.fonts.load) {
    // the letterforms are sampled from Fraunces, so it must be there first
    document.fonts.load('400 80px Fraunces').then(start).catch(start);
    setTimeout(function () { if (!t0 && !done) start(); }, 900);
  } else {
    start();
  }
})();
