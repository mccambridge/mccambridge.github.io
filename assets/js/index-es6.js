'use strict';

(function () {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const $c = Canyon(ctx, canvas);

  // ── Viewport / DPR sizing ─────────────────────────────────────────────────

  function setDimensions() {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    // Scale context once so all drawing coords are in logical CSS px
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  // ── Build a fresh field of plusses ────────────────────────────────────────

  function buildPlusses() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // ── Size distribution: power=4.0 ──────────────────────────────────────
    // minSize=20 so even the small ones have real body.
    // maxSize=280 for a wider ceiling — rare to hit but dramatic when it does.
    // power=4.0: ~50% of plusses fall below 37px, top 10% above 190px,
    //            top 5% above 230px — those few span 190–280px for wide variety.
    const minSize = 20;
    const maxSize = 280;
    const sizeRange = maxSize - minSize;

    // ── Count scales with viewport area ────────────────────────────────────
    // 0.75 exponent keeps mobile from overcrowding.
    // Desktop 1728×992 → ~145 | tablet 768×1024 → ~78 | phone 390×844 → ~42
    const refArea = 1728 * 992;
    const vpArea = w * h;
    const count = Math.round(Math.min(Math.max(145 * Math.pow(vpArea / refArea, 0.75), 22), 180));

    const plusses = [];

    // ── Hero: large teal ──
    plusses.push(makeThing(
      getRandomInt(0, w), getRandomInt(0, h),
      250,
      'rgba(30, 255, 250, 0.65)',
      getRandomInt(0, 360), getRandomInt(4, 12)
    ));

    // ── Hero: red ──
    plusses.push(makeThing(
      getRandomInt(0, w), getRandomInt(0, h),
      115,
      'rgba(200, 50, 50, 0.5)',
      getRandomInt(0, 360), getRandomInt(4, 12)
    ));

    // ── Random field: power=4.0 distribution ───────────────────────────────
    // ~50% below 37px (body presence, not dots), top 10% above 190px (rare drama).
    // Large ones span 190–280px when they appear — genuinely varied at the top end.
    for (let i = 0; i < count; i++) {
      const t = Math.pow(Math.random(), 5.0);  // steep → lots of smalls, very few larges
      const size = Math.round(minSize + t * sizeRange);

      const red = getRandomInt(50, 120);
      const green = getRandomInt(100, 200);
      const blue = getRandomInt(100, 220);
      const opacity = (Math.sqrt(size / maxSize) * 0.68).toFixed(3);

      plusses.push(makeThing(
        getRandomInt(0, w), getRandomInt(0, h),
        size,
        'rgba(' + red + ', ' + green + ', ' + blue + ', ' + opacity + ')',
        getRandomInt(0, 360), getRandomInt(2, 14)
      ));
    }

    return plusses;
  }

  function makeThing(x, y, size, color, startRot, rpm) {
    return {
      x, y, size, color, startRot, rpm,
      repelDx: 0, repelDy: 0,
      ripple0Dx: 0, ripple0Dy: 0,
      rippleStart: 0, rippleDuration: 0,
    };
  }

  // ── Create / reset the scene ──────────────────────────────────────────────

  function create() {
    $c.kill();
    setDimensions();
    $c.clearArtboard();
    const plusses = buildPlusses();
    $c.init(plusses);
    $c.defineAnimation((now, mx, my) => $c.drawFrame(now, mx, my));
    $c.start();
  }

  // ── Mouse / pointer tracking ──────────────────────────────────────────────

  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    $c.setMouse(e.clientX - rect.left, e.clientY - rect.top);
  });

  canvas.addEventListener('pointerleave', () => {
    $c.clearMouse();
  });

  // ── Click / tap: single = ripple, double = reset ─────────────────────────

  let lastTapTime = 0;
  const DOUBLE_TAP_MS = 350;

  function handleTap(x, y) {
    const now = Date.now();
    if (now - lastTapTime < DOUBLE_TAP_MS) {
      create();
    } else {
      $c.ripple(x, y);
    }
    lastTapTime = now;
  }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    handleTap(e.clientX - rect.left, e.clientY - rect.top);
  });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const rect = canvas.getBoundingClientRect();
    handleTap(touch.clientX - rect.left, touch.clientY - rect.top);
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    $c.setMouse(touch.clientX - rect.left, touch.clientY - rect.top);
  }, { passive: false });

  canvas.addEventListener('touchstart', () => { }, { passive: true });

  // ── Resize: refit, don't reset ───────────────────────────────────────────

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const dpr = window.devicePixelRatio || 1;
      const newW = Math.round(window.innerWidth * dpr);
      const newH = Math.round(window.innerHeight * dpr);
      if (Math.abs(newW - canvas.width) > 10 || Math.abs(newH - canvas.height) > 10) {
        setDimensions();
      }
    }, 150);
  });

  window.addEventListener('orientationchange', () => {
    setTimeout(setDimensions, 300);
  });

  // ── Boot ──────────────────────────────────────────────────────────────────

  create();

})();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
