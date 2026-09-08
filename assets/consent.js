/* Wing Digital consent + analytics loader.
   ------------------------------------------------------------------
   JACK: PASTE YOUR MEASUREMENT ID ON THE NEXT LINE AND NOWHERE ELSE.
   GA4 looks like 'G-XXXXXXXXXX'. Leave it empty and the whole thing
   stays inert: no banner, no cookies, no network calls.
   ------------------------------------------------------------------ */
var WING_ANALYTICS_ID = '';

(function () {
  'use strict';

  var KEY = 'wing-consent';       // 'granted' or 'denied'
  var id = (WING_ANALYTICS_ID || '').trim();
  if (!id) return;                // nothing configured, nothing to consent to

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* private mode */ }
  }

  var loaded = false;
  function loadAnalytics() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
  }

  function banner() {
    var el = document.createElement('div');
    el.className = 'cc';
    el.id = 'consent';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-label', 'Analytics consent');

    var p = document.createElement('p');
    p.appendChild(document.createTextNode(
      'We would like to measure which pages people read, using Google Analytics. ' +
      'It sets cookies. Say no and nothing loads. '));
    var a = document.createElement('a');
    a.href = 'privacy.html';
    a.textContent = 'Privacy policy';
    p.appendChild(a);
    p.appendChild(document.createTextNode('.'));

    var acts = document.createElement('div');
    acts.className = 'cc-acts';

    function mk(label, choice) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn--onink';
      b.textContent = label;
      b.addEventListener('click', function () {
        write(choice);
        if (choice === 'granted') loadAnalytics();
        el.parentNode && el.parentNode.removeChild(el);
      });
      return b;
    }
    var no = mk('No thanks', 'denied');
    no.className = 'btn btn--ghost';
    acts.appendChild(no);
    acts.appendChild(mk('Allow', 'granted'));

    el.appendChild(p);
    el.appendChild(acts);

    el.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        write('denied');
        el.parentNode && el.parentNode.removeChild(el);
      }
    });

    document.body.appendChild(el);
  }

  function start() {
    var choice = read();
    if (choice === 'granted') { loadAnalytics(); return; }
    if (choice === 'denied') return;
    banner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
