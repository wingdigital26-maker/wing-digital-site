/* Wing Digital — behaviour layer v2.
   Rules: one reveal moment near the top, nothing generative,
   nothing that runs a loop forever. See design-dna.md. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- intro: wordmark wipe, home page only ---------- */
  var intro = document.getElementById('intro');
  if (intro) {
    if (reduced) {
      intro.classList.add('done');
    } else {
      requestAnimationFrame(function () { intro.classList.add('open'); });
      // grid 1.5s + iris 0.75s = 2.25s; pull it from the layer after that.
      setTimeout(function () { intro.classList.add('done'); }, 2450);
    }
  }

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var hero = document.querySelector('.hero, .page-head');
    // solid once the dark band above has scrolled past the nav's own height
    var solidAt = function () {
      return hero ? Math.max(40, hero.offsetHeight - nav.offsetHeight) : 40;
    };
    var onScroll = function () {
      nav.classList.toggle('solid', window.scrollY > solidAt());
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    var burger = nav.querySelector('.burger');
    if (burger) {
      var cta = nav.querySelector('.nav-cta');
      var links = nav.querySelector('.navlinks');
      var ctaHome = cta && cta.parentNode;

      burger.addEventListener('click', function () {
        var open = nav.classList.toggle('menu-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        // the CTA lives in the header row on desktop and inside the panel on
        // phones, so it never overlaps the last nav link
        if (cta && links) {
          if (open) links.appendChild(cta);
          else if (ctaHome) ctaHome.appendChild(cta);
        }
      });

      // going back to desktop width with the menu open must not strand the CTA
      window.addEventListener('resize', function () {
        if (window.innerWidth > 900 && nav.classList.contains('menu-open')) {
          nav.classList.remove('menu-open');
          burger.setAttribute('aria-expanded', 'false');
          if (cta && ctaHome) ctaHome.appendChild(cta);
        }
      });
    }

    /* mark the current page instead of leaving the nav stateless */
    var here = location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('.navlinks a').forEach(function (a) {
      if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
    });
  }

  /* ---------- FAQ: real disclosure semantics ---------- */
  document.querySelectorAll('.qa').forEach(function (qa) {
    var btn = qa.querySelector('button');
    var ans = qa.querySelector('.ans');
    if (!btn || !ans) return;

    if (!ans.id) ans.id = 'ans-' + Math.random().toString(36).slice(2, 9);
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', ans.id);
    ans.hidden = true;

    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      // one open at a time
      document.querySelectorAll('.qa').forEach(function (o) {
        var b = o.querySelector('button'), a = o.querySelector('.ans');
        if (b && a) { b.setAttribute('aria-expanded', 'false'); a.hidden = true; }
      });
      if (!open) { btn.setAttribute('aria-expanded', 'true'); ans.hidden = false; }
    });
  });

  /* ---------- service selector on the hero ---------- */
  var seg = document.querySelector('[data-seg]');
  if (seg) {
    var body = document.getElementById('segBody');
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || !body) return;
      seg.querySelectorAll('button').forEach(function (o) {
        o.classList.toggle('on', o === b);
        o.setAttribute('aria-selected', o === b ? 'true' : 'false');
      });
      body.innerHTML = b.dataset.copy || '';
    });
  }

  /* ---------- ONE reveal moment: the first two things below the fold.
       Everything further down is static on purpose (hard rule 2). ---------- */
  var rv = [].slice.call(document.querySelectorAll('.rv'));
  if (reduced || !('IntersectionObserver' in window)) {
    rv.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.16 });
    rv.forEach(function (el, i) {
      if (i < 2) io.observe(el); else el.classList.add('in');
    });
  }
})();
