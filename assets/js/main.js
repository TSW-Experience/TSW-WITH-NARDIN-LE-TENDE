/* Nardin Le Tende · Homepage
   Header sticky, menu mobile, video, reveal, tab bisogni, caroselli, FAQ, showroom (orari e CAP). */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var smooth = function () { return reduced ? 'auto' : 'smooth'; };
  root.classList.add('js');

  /* ---------- Dati ---------- */

  // Orari SEGNAPOSTO (minuti dalla mezzanotte, 0 = domenica): sostituire con gli orari reali di ogni showroom.
  var HOURS = { 0: [], 1: [[540, 750], [900, 1140]], 2: [[540, 750], [900, 1140]], 3: [[540, 750], [900, 1140]], 4: [[540, 750], [900, 1140]], 5: [[540, 750], [900, 1140]], 6: [[540, 750]] };
  var DAYS = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];

  var SHOWS = [
    { name: 'Ponte di Piave (TV)', addr: "Via dell'Artigianato, 11" },
    { name: 'Fossalta di Portogruaro (VE)', addr: 'Via Aldo Moro, 1/G5' },
    { name: 'Mogliano Veneto (TV)', addr: 'Via Terraglio, 35' }
  ];

  // Associazione statica CAP → showroom (0 Ponte di Piave, 1 Fossalta di Portogruaro, 2 Mogliano Veneto). La prima regola che corrisponde vince.
  var CAP_RULES = [
    { from: 30027, to: 30027, s: 0 }, // San Donà di Piave
    { from: 30020, to: 30029, s: 1 }, // Portogruaro, San Michele al T., Bibione, Caorle…
    { from: 33070, to: 33099, s: 1 }, // Pordenone e provincia
    { from: 33170, to: 33170, s: 1 }, // Pordenone città
    { from: 30010, to: 30019, s: 2 }, // Riviera, Jesolo, Mira…
    { from: 30030, to: 30039, s: 2 }, // Mirano, Noale, Martellago…
    { from: 30100, to: 30199, s: 2 }, // Venezia e Mestre
    { from: 31020, to: 31022, s: 2 }, // Mogliano, Preganziol
    { from: 31100, to: 31100, s: 2 }, // Treviso città
    { from: 31000, to: 31999, s: 0 }  // resto della provincia di Treviso
  ];

  /* ---------- Reveal testi e immagini ---------- */

  var noIO = reduced || !('IntersectionObserver' in window);
  var io = noIO ? null : new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  var seen = new WeakSet();
  var scanReveal = function () {
    document.querySelectorAll('.rv:not(.in),.ri:not(.in)').forEach(function (el) {
      if (noIO) { el.classList.add('in'); return; }
      var r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) { el.classList.add('in'); return; }
      if (seen.has(el)) return;
      seen.add(el); io.observe(el);
    });
  };
  var scanT = 0;
  window.addEventListener('scroll', function () { clearTimeout(scanT); scanT = setTimeout(scanReveal, 150); }, { passive: true });
  scanReveal();

  /* ---------- Video (autoplay, loop, pausa accessibile) ---------- */

  var setVideoBtn = function (btn, playing) {
    btn.setAttribute('aria-label', playing ? btn.dataset.labelPause : btn.dataset.labelPlay);
    btn.setAttribute('aria-pressed', String(!playing));
    btn.querySelector('[data-icon=pause]').hidden = !playing;
    btn.querySelector('[data-icon=play]').hidden = playing;
  };
  document.querySelectorAll('[data-video]').forEach(function (btn) {
    var v = document.getElementById(btn.dataset.video);
    if (!v) return;
    v.muted = true; v.loop = true;
    if (reduced) { v.pause(); setVideoBtn(btn, false); }
    else { var p = v.play(); if (p) p.catch(function () { setVideoBtn(btn, false); }); }
    btn.addEventListener('click', function () {
      if (v.paused) { var q = v.play(); if (q) q.catch(function () {}); setVideoBtn(btn, true); }
      else { v.pause(); setVideoBtn(btn, false); }
    });
  });

  /* ---------- Header sticky e parallasse (fallback senza scroll-driven animations) ---------- */

  var hdr = document.getElementById('hdr');
  var mm = document.getElementById('mm');
  var menuOpen = false;
  var sdView = window.CSS && CSS.supports('animation-timeline: view()');
  var pxs = [].slice.call(document.querySelectorAll('.px'));
  var raf = 0;
  var frame = function () {
    raf = 0;
    var y = scrollY;
    if (!menuOpen) hdr.dataset.s = y < 8 ? 'top' : 'solid';
    if (!sdView && !reduced) {
      var wide = innerWidth >= 1440, vh = innerHeight;
      pxs.forEach(function (el) {
        if (!wide) { el.style.transform = ''; return; }
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        el.style.transform = 'translateY(' + ((p - 0.5) * 8).toFixed(2) + '%)';
      });
    }
  };
  var onScroll = function () { if (!raf) raf = requestAnimationFrame(frame); };
  window.addEventListener('scroll', onScroll, { passive: true });
  frame();

  /* ---------- Menu mobile ---------- */

  var burger = document.querySelector('[data-menu-open]');
  var setMenu = function (open) {
    menuOpen = open;
    mm.dataset.open = String(open);
    mm.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    root.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', function () {
    setMenu(true);
    setTimeout(function () { var x = document.getElementById('mmX'); if (x) x.focus(); }, 60);
  });
  document.querySelector('[data-menu-close]').addEventListener('click', function () {
    if (!menuOpen) return;
    setMenu(false);
    burger.focus({ preventScroll: true });
  });
  document.querySelectorAll('[data-menu-nav]').forEach(function (a) {
    a.addEventListener('click', function () { if (menuOpen) setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) { setMenu(false); burger.focus({ preventScroll: true }); }
  });
  window.addEventListener('resize', function () {
    if (innerWidth >= 1024 && menuOpen) setMenu(false);
    onScroll();
  });

  /* ---------- Numero del passo sticky ---------- */

  var num = document.getElementById('stepNum');
  if (num && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && num.textContent !== e.target.dataset.n) {
          num.textContent = e.target.dataset.n;
          if (!reduced && num.animate) num.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.2,.7,.2,1)' });
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    document.querySelectorAll('.step').forEach(function (el) { io2.observe(el); });
  }

  /* ---------- Voce di menu attiva in base alla sezione visibile ---------- */

  if ('IntersectionObserver' in window) {
    var links = [].slice.call(document.querySelectorAll('.nl'));
    var io3 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['top', 'manifesto', 'bisogni', 'metodo', 'progetti', 'faq', 'showroom'].forEach(function (id) {
      var el = document.getElementById(id); if (el) io3.observe(el);
    });
  }

  /* ---------- Tab "Di cosa ha bisogno la tua casa?" ---------- */

  var tabs = [].slice.call(document.querySelectorAll('[role=tab]'));
  var selectTab = function (i, focus) {
    tabs.forEach(function (t, j) {
      var sel = i === j;
      var pan = document.getElementById(t.getAttribute('aria-controls'));
      t.setAttribute('aria-selected', String(sel));
      t.tabIndex = sel ? 0 : -1;
      pan.dataset.on = String(sel);
      pan.setAttribute('aria-hidden', String(!sel));
      pan.tabIndex = sel ? 0 : -1;
    });
    if (focus) tabs[i].focus();
  };
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(i, false); });
    t.addEventListener('keydown', function (e) {
      var n = tabs.length, j = i, k = e.key;
      if (k === 'ArrowDown' || k === 'ArrowRight') j = (i + 1) % n;
      else if (k === 'ArrowUp' || k === 'ArrowLeft') j = (i - 1 + n) % n;
      else if (k === 'Home') j = 0;
      else if (k === 'End') j = n - 1;
      else return;
      e.preventDefault();
      selectTab(j, true);
    });
  });

  /* ---------- Caroselli ---------- */

  var initCar = function (c) {
    var tr = c.querySelector('[data-track]'); if (!tr) return;
    var prev = c.querySelector('[data-prev]'), next = c.querySelector('[data-next]');
    var dots = [].slice.call(c.querySelectorAll('[data-dot]'));
    var stepW = function () { var it = tr.children; return it.length > 1 ? it[1].offsetLeft - it[0].offsetLeft : tr.clientWidth; };
    var upd = function () {
      var max = tr.scrollWidth - tr.clientWidth;
      var i = Math.round(tr.scrollLeft / stepW());
      if (tr.scrollLeft >= max - 2) i = dots.length - 1;
      dots.forEach(function (d, j) { d.classList.toggle('on', j === Math.min(i, dots.length - 1)); });
      if (prev) prev.disabled = tr.scrollLeft <= 2;
      if (next) next.disabled = tr.scrollLeft >= max - 2;
    };
    if (prev) prev.addEventListener('click', function () { tr.scrollBy({ left: -stepW(), behavior: smooth() }); });
    if (next) next.addEventListener('click', function () { tr.scrollBy({ left: stepW(), behavior: smooth() }); });
    tr.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();

    // Trascinamento con il mouse
    var down = false, sx = 0, sl = 0, moved = false;
    tr.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sl = tr.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 5) { moved = true; tr.classList.add('drag'); }
      if (moved) tr.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      if (!moved) return;
      var w = stepW();
      tr.scrollTo({ left: Math.round(tr.scrollLeft / w) * w, behavior: smooth() });
      setTimeout(function () { tr.classList.remove('drag'); }, 450);
    });
    tr.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    tr.addEventListener('dragstart', function (e) { e.preventDefault(); });
  };
  document.querySelectorAll('[data-carousel]').forEach(initCar);

  /* ---------- FAQ ---------- */

  document.querySelectorAll('.fq').forEach(function (b) {
    b.addEventListener('click', function () {
      var fi = b.closest('.fi');
      var open = fi.dataset.open !== 'true';
      fi.dataset.open = String(open);
      b.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Showroom: stato apertura ---------- */

  var fmt = function (min) { return Math.floor(min / 60) + ':' + String(min % 60).padStart(2, '0'); };
  var status = function (now) {
    var d = now.getDay(), m = now.getHours() * 60 + now.getMinutes();
    var today = HOURS[d] || [];
    var cur = today.find(function (s) { return m >= s[0] && m < s[1]; });
    if (cur) return { open: true, text: 'Aperto ora · chiude alle ' + fmt(cur[1]) };
    var later = today.find(function (s) { return s[0] > m; });
    if (later) return { open: false, text: 'Chiuso · apre alle ' + fmt(later[0]) };
    for (var k = 1; k <= 7; k++) {
      var dd = (d + k) % 7, sl = HOURS[dd];
      if (sl && sl.length) return { open: false, text: 'Chiuso · apre ' + (k === 1 ? 'domani' : DAYS[dd]) + ' alle ' + fmt(sl[0][0]) };
    }
    return { open: false, text: 'Chiuso' };
  };
  var sts = [].slice.call(document.querySelectorAll('[data-status]'));
  var updStatus = function () {
    var st = status(new Date());
    sts.forEach(function (el) { el.dataset.open = String(st.open); el.lastElementChild.textContent = st.text; });
  };
  updStatus();
  setInterval(updStatus, 60000);

  /* ---------- Showroom: CAP → showroom più vicino ---------- */

  var form = document.getElementById('capForm');
  var cap = document.getElementById('cap');
  var msg = document.getElementById('capmsg');
  var shoEls = [].slice.call(document.querySelectorAll('.sho'));
  var setCap = function (err, near, text) {
    cap.setAttribute('aria-invalid', String(err));
    msg.dataset.err = String(err);
    msg.textContent = text;
    shoEls.forEach(function (el, i) { el.dataset.near = String(i === near); });
  };
  cap.addEventListener('input', function () {
    var v = cap.value.replace(/\D/g, '').slice(0, 5);
    if (v !== cap.value) cap.value = v;
    cap.setAttribute('aria-invalid', 'false');
    msg.dataset.err = 'false';
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var c = cap.value;
    if (!/^\d{5}$/.test(c)) return setCap(true, -1, 'Serve un CAP di cinque cifre.');
    var n = parseInt(c, 10);
    var r = CAP_RULES.find(function (r) { return n >= r.from && n <= r.to; });
    if (!r) return setCap(false, -1, 'Questo CAP è fuori dalle zone che copriamo di solito. Scrivici comunque: [indicazioni per le richieste fuori zona].');
    var s = SHOWS[r.s];
    setCap(false, r.s, 'Lo showroom più vicino è ' + s.name + ' · ' + s.addr + '.');
  });
})();
