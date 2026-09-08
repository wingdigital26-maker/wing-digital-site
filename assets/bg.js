/* Wing Digital — animated band backgrounds.
   One engine, six variants, one per page, so no two pages open the same way.

   Usage:  <div class="bg" data-bg="signal" aria-hidden="true"></div>
           placed as the first child of a .hero, .page-head or .contact band.

   Rules this file obeys:
   - Only ever painted on the dark bands. Light editorial bands stay clean.
   - Stops completely when off screen, when the tab is hidden, and under
     prefers-reduced-motion (where it paints one static frame instead).
   - No library, no gradients with two hues, brand blue only.
   - Capped at 2x DPR and a few hundred ops per frame so phones stay cool.
*/
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ACCENT = '61,107,240';        // --accent, lifted a touch for dark grounds
  var PAPER = '250,249,246';

  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* ---------------------------------------------------------------- variants
     Each returns { init(w,h), draw(ctx,w,h,t,pointer) }. t is seconds. */

  var VARIANTS = {

    /* home: a field of nodes that link up when they drift close, with a slow
       sweep passing through. The site sells online presence; this is a network
       finding each other. */
    signal: function () {
      var pts = [];
      return {
        init: function (w, h) {
          var n = Math.min(90, Math.round(w * h / 17000));
          pts = [];
          for (var i = 0; i < n; i++) {
            pts.push({ x: rnd(0, w), y: rnd(0, h), vx: rnd(-6, 6), vy: rnd(-6, 6), r: rnd(0.7, 1.9) });
          }
        },
        draw: function (c, w, h, t, p) {
          var i, j, a, b, d, sweep = ((t * 0.06) % 1.4) - 0.2;
          for (i = 0; i < pts.length; i++) {
            a = pts[i];
            a.x += a.vx / 60; a.y += a.vy / 60;
            if (a.x < 0) a.x += w; if (a.x > w) a.x -= w;
            if (a.y < 0) a.y += h; if (a.y > h) a.y -= h;
            // the pointer nudges nearby nodes: the interactive bit
            if (p.on) {
              var dx = a.x - p.x, dy = a.y - p.y, dd = dx * dx + dy * dy;
              if (dd < 26000 && dd > 1) {
                var f = (1 - dd / 26000) * 0.6;
                a.x += dx / Math.sqrt(dd) * f; a.y += dy / Math.sqrt(dd) * f;
              }
            }
          }
          c.lineWidth = 1;
          for (i = 0; i < pts.length; i++) {
            a = pts[i];
            for (j = i + 1; j < pts.length; j++) {
              b = pts[j];
              d = (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
              if (d > 22000) continue;
              var o = (1 - d / 20000) * 0.34;
              // the sweep brightens links as it crosses them
              var mx = (a.x + b.x) / 2 / w;
              o += Math.max(0, 0.5 - Math.abs(mx - sweep) * 6) * 0.30;
              c.strokeStyle = 'rgba(' + ACCENT + ',' + o.toFixed(3) + ')';
              c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
            }
          }
          for (i = 0; i < pts.length; i++) {
            a = pts[i];
            var lit = Math.max(0, 0.5 - Math.abs(a.x / w - sweep) * 6);
            c.fillStyle = 'rgba(' + PAPER + ',' + (0.28 + lit * 0.6).toFixed(3) + ')';
            c.beginPath(); c.arc(a.x, a.y, a.r + lit * 1.1, 0, 6.284); c.fill();
          }
        }
      };
    },

    /* services: a perspective grid running to a horizon, gently breathing.
       Four services, one system underneath. */
    mesh: function () {
      return {
        init: function () {},
        draw: function (c, w, h, t) {
          var hz = h * 0.42, i, x, y, k;
          c.lineWidth = 1;
          for (i = 0; i <= 22; i++) {
            k = i / 22;
            x = (k - 0.5) * w * 2.6 + w / 2 + Math.sin(t * 0.15 + i) * 5;
            c.strokeStyle = 'rgba(' + ACCENT + ',' + (0.07 + Math.max(0, 0.22 - Math.abs(k - 0.5) * 0.30)).toFixed(3) + ')';
            c.beginPath(); c.moveTo(x, h); c.lineTo(w / 2, hz); c.stroke();
          }
          for (i = 1; i <= 16; i++) {
            k = i / 16;
            var pz = Math.pow(k, 2.4);
            y = hz + pz * (h - hz) + ((t * 26) % ((h - hz) / 16));
            if (y > h) continue;
            c.strokeStyle = 'rgba(' + ACCENT + ',' + (0.06 + pz * 0.28).toFixed(3) + ')';
            c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke();
          }
        }
      };
    },

    /* work: concentric rings turning at different rates, with markers riding
       them. Systems in orbit around a client. */
    orbit: function () {
      return {
        init: function () {},
        draw: function (c, w, h, t) {
          var cx = w * 0.76, cy = h * 0.5, i, r, ang;
          for (i = 0; i < 6; i++) {
            r = 70 + i * 64;
            c.strokeStyle = 'rgba(' + ACCENT + ',' + (0.40 - i * 0.045).toFixed(3) + ')';
            c.lineWidth = i % 2 ? 1 : 1.8;
            var gap = 0.6 + i * 0.22, off = t * (0.1 + i * 0.05);
            c.beginPath(); c.arc(cx, cy, r, off, off + 6.284 - gap); c.stroke();
            ang = t * (0.22 - i * 0.028) + i * 1.7;
            var mx = cx + Math.cos(ang) * r, my = cy + Math.sin(ang) * r;
            c.fillStyle = 'rgba(' + PAPER + ',' + (0.85 - i * 0.09).toFixed(3) + ')';
            c.beginPath(); c.arc(mx, my, 2.8, 0, 6.284); c.fill();
          }
        }
      };
    },

    /* blog: a fine dot grid with a soft light moving across it. */
    grid: function () {
      return {
        init: function () {},
        draw: function (c, w, h, t) {
          var s = 34, lx = w * (0.5 + Math.sin(t * 0.11) * 0.42),
              ly = h * (0.5 + Math.cos(t * 0.083) * 0.42), x, y;
          for (x = s / 2; x < w; x += s) {
            for (y = s / 2; y < h; y += s) {
              var d = Math.hypot(x - lx, y - ly), o = Math.max(0, 1 - d / 340);
              if (o < 0.02) { continue; }
              c.fillStyle = 'rgba(' + ACCENT + ',' + (0.07 + o * 0.72).toFixed(3) + ')';
              c.beginPath(); c.arc(x, y, 1.0 + o * 1.9, 0, 6.284); c.fill();
            }
          }
        }
      };
    },

    /* about: slow horizontal field lines, like a signal settling. */
    flow: function () {
      return {
        init: function () {},
        draw: function (c, w, h, t) {
          var i, x, y, k;
          c.lineWidth = 1;
          for (i = 0; i < 16; i++) {
            k = i / 16;
            c.strokeStyle = 'rgba(' + ACCENT + ',' + (0.14 + Math.sin(k * 3.14) * 0.52).toFixed(3) + ')';
            c.beginPath();
            for (x = 0; x <= w; x += 14) {
              y = h * k + Math.sin(x * 0.0055 + t * 0.5 + i * 0.7) * (10 + i * 1.6)
                        + Math.sin(x * 0.0017 - t * 0.28) * 12;
              if (x === 0) c.moveTo(x, y); else c.lineTo(x, y);
            }
            c.stroke();
          }
        }
      };
    },

    /* contact + 404: rings pulsing out from one point. A signal being sent. */
    pulse: function () {
      return {
        init: function () {},
        draw: function (c, w, h, t) {
          var cx = w * 0.5, cy = h * 0.5, i, k, r, o;
          c.lineWidth = 1;
          for (i = 0; i < 5; i++) {
            k = ((t * 0.16) + i / 5) % 1;
            r = k * Math.max(w, h) * 0.62;
            o = (1 - k) * 0.62;
            c.strokeStyle = 'rgba(' + ACCENT + ',' + o.toFixed(3) + ')';
            c.beginPath(); c.arc(cx, cy, r, 0, 6.284); c.stroke();
          }
        }
      };
    }
  };

  /* ------------------------------------------------------------------ engine */

  function mount(host) {
    var name = host.dataset.bg || 'signal';
    var make = VARIANTS[name] || VARIANTS.signal;
    var v = make();

    var cv = document.createElement('canvas');
    cv.setAttribute('aria-hidden', 'true');
    host.appendChild(cv);
    var c = cv.getContext('2d');

    var w = 0, h = 0, dpr = 1, raf = 0, running = false, t0 = 0;
    var pointer = { x: 0, y: 0, on: false };

    function size() {
      var r = host.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = w * dpr; cv.height = h * dpr;
      cv.style.width = w + 'px'; cv.style.height = h + 'px';
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      v.init(w, h);
    }

    function frame(now) {
      if (!running) return;
      if (!t0) t0 = now;
      c.clearRect(0, 0, w, h);
      v.draw(c, w, h, (now - t0) / 1000, pointer);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || REDUCED) return;
      running = true; raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    size();
    if (REDUCED) {
      // one static frame: the composition without the motion
      c.clearRect(0, 0, w, h);
      v.draw(c, w, h, 2.2, pointer);
    } else {
      var onScreen = true;
      if ('IntersectionObserver' in window) {
        onScreen = false;
        new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            onScreen = e.isIntersecting;
            (onScreen && !document.hidden) ? start() : stop();
          });
        }, { threshold: 0 }).observe(host);
      } else {
        start();
      }
      // coming back to the tab must NOT restart a band that is scrolled away
      document.addEventListener('visibilitychange', function () {
        (!document.hidden && onScreen) ? start() : stop();
      });
    }

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { size(); }, 180);
    });

    // interactivity, on the hero only, and only for a pointer that can hover
    if (name === 'signal' && window.matchMedia('(hover:hover)').matches) {
      host.parentNode.addEventListener('pointermove', function (e) {
        var r = host.getBoundingClientRect();
        pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.on = true;
      });
      host.parentNode.addEventListener('pointerleave', function () { pointer.on = false; });
    }
  }

  function boot() {
    var hosts = document.querySelectorAll('.bg[data-bg]');
    for (var i = 0; i < hosts.length; i++) mount(hosts[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
