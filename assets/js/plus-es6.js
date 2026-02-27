'use strict';

// ─── Path2D cache (build each plus shape once per size) ──────────────────────

const _pathCache = new Map();

function _buildPlusPath(size) {
  if (_pathCache.has(size)) return _pathCache.get(size);
  const gW = size / 3;
  const offset = size / -2;
  const p = new Path2D();
  p.moveTo(gW + offset, 0 + offset);
  p.lineTo(gW * 2 + offset, 0 + offset);
  p.lineTo(gW * 2 + offset, gW + offset);
  p.lineTo(gW * 3 + offset, gW + offset);
  p.lineTo(gW * 3 + offset, gW * 2 + offset);
  p.lineTo(gW * 2 + offset, gW * 2 + offset);
  p.lineTo(gW * 2 + offset, gW * 3 + offset);
  p.lineTo(gW + offset, gW * 3 + offset);
  p.lineTo(gW + offset, gW * 2 + offset);
  p.lineTo(0 + offset, gW * 2 + offset);
  p.lineTo(0 + offset, gW + offset);
  p.lineTo(gW + offset, gW + offset);
  p.closePath();
  _pathCache.set(size, p);
  return p;
}

// ─── Easing ──────────────────────────────────────────────────────────────────

const ease = {
  inOutQuint: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
  outQuart: t => 1 - (--t) * t * t * t,
  outCubic: t => (--t) * t * t + 1,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Canyon factory ──────────────────────────────────────────────────────────

const Canyon = (ctx, canvas) => {
  let renderFn = null;
  let startTime = null;
  let engineId = null;
  let things = [];

  // Passive drift: Map<index, {tx, ty, startX, startY, progress (0→1), duration}>
  let drifts = new Map();

  // Reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fpsLimit = prefersReduced ? 24 : 60;
  const frameMs = 1000 / fpsLimit;
  let lastFrameTime = 0;

  // Mouse repulsion — size-proportional:
  //   t.size < SIZE_REPEL_DEAD  → completely immune (background texture)
  //   t.size ≥ SIZE_REPEL_FULL  → maximum displacement / radius
  const SIZE_REPEL_DEAD = 45;   // px — below this: no movement at all
  const SIZE_REPEL_FULL = 210;  // px — at/above this: full effect
  const REPEL_MAX_DIST = 240;  // logical px — max displacement for biggest shapes
  const REPEL_LERP = 0.20; // per-frame lerp factor (higher = snappier)
  const REPEL_RETURN = 0.10; // lerp back to 0 when outside radius

  // ── Clear ──────────────────────────────────────────────────────────────────

  const _clearArtboard = () => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  // ── Draw one plus ──────────────────────────────────────────────────────────

  const _drawPlus = (x, y, size, color, deg) => {
    const path = _buildPlusPath(size);
    const rad = Math.PI * deg / 180;
    ctx.save();
    ctx.translate(x + size / 3, y);
    ctx.rotate(rad);
    ctx.fillStyle = color;
    ctx.fill(path);
    ctx.restore();
  };

  // ── Per-frame draw pass ────────────────────────────────────────────────────
  // mouseX/mouseY: current pointer in logical CSS px, or null when off-canvas

  const _drawFrame = (now, mouseX, mouseY) => {
    const elapsed = now - startTime;

    things.forEach((t, i) => {
      // ── Passive drift offset (mover commits back to base) ──────────────────
      let driftDx = 0, driftDy = 0;
      if (drifts.has(i)) {
        const d = drifts.get(i);
        const p = Math.min((now - d.start) / d.duration, 1);
        const e = ease.inOutQuint(p);
        driftDx = d.tx * e;
        driftDy = d.ty * e;
        if (p >= 1) {
          t.x += d.tx;
          t.y += d.ty;
          drifts.delete(i);
        }
      }

      // ── Mouse repulsion: size-proportional, lerped per frame ────────────
      // Small things (< 45px) are background texture — they never move.
      // Larger things scale up: bigger radius, bigger push distance.
      let targetRepelX = 0, targetRepelY = 0;
      if (mouseX !== null && mouseY !== null) {
        // sizeFactor: 0 at threshold, 1 at full — clamped, linear ramp
        const sizeFactor = Math.max(0, Math.min(1,
          (t.size - SIZE_REPEL_DEAD) / (SIZE_REPEL_FULL - SIZE_REPEL_DEAD)
        ));

        if (sizeFactor > 0) {
          const cx = t.x + driftDx;
          const cy = t.y + driftDy;
          // Radius and max push both scale with size
          const radius = t.size * 0.9 + 80;   // size=80 → 152px | size=200 → 260px
          const strength = REPEL_MAX_DIST * sizeFactor;

          const dx = cx - mouseX;
          const dy = cy - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

          if (dist < radius) {
            const push = (1 - dist / radius) * strength;
            targetRepelX = (dx / dist) * push;
            targetRepelY = (dy / dist) * push;
          }
        }
      }
      // Lerp toward target (snappy entry, smooth return)
      const lerpFactor = (targetRepelX !== 0 || targetRepelY !== 0)
        ? REPEL_LERP
        : REPEL_RETURN;
      t.repelDx += (targetRepelX - t.repelDx) * lerpFactor;
      t.repelDy += (targetRepelY - t.repelDy) * lerpFactor;

      // ── Ripple: stored directly on thing, decays independently ────────────
      let rippleDx = 0, rippleDy = 0;
      if (t.rippleDuration > 0) {
        const p = Math.min((now - t.rippleStart) / t.rippleDuration, 1);
        // Push out fast, ease back slowly
        const eased = p < 0.35
          ? ease.outQuart(p / 0.35)           // rapid expansion
          : 1 - ease.outCubic((p - 0.35) / 0.65); // long gentle return
        rippleDx = t.ripple0Dx * eased;
        rippleDy = t.ripple0Dy * eased;
        if (p >= 1) {
          t.rippleDuration = 0; // done
        }
      }

      // ── Compose and draw ───────────────────────────────────────────────────
      const drawX = t.x + driftDx + t.repelDx + rippleDx;
      const drawY = t.y + driftDy + t.repelDy + rippleDy;
      const rotDeg = (elapsed / 1000 % t.rpm) / t.rpm * 360 + t.startRot;
      _drawPlus(drawX, drawY, t.size, t.color, rotDeg);
    });
  };

  // ── Random passive drift (occasional nudge) ────────────────────────────────

  const _randomDrift = (now) => {
    if (Math.random() < 0.004 && things.length > 0) {
      const i = getRandomInt(0, things.length - 1);
      if (!drifts.has(i)) {
        drifts.set(i, {
          start: now,
          tx: getRandomInt(12, 160) - 80,
          ty: getRandomInt(12, 160) - 80,
          duration: getRandomInt(1200, 4000),
        });
      }
    }
  };

  // ── Ripple burst from a logical-px point ──────────────────────────────────
  // Written directly to each thing — completely independent of mouse repulsion.

  const _ripple = (px, py) => {
    const now = performance.now();
    things.forEach((t, i) => {
      // Current visual position (approximate — ignore in-flight drift)
      const dx = t.x - px;
      const dy = t.y - py;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      // Strength falls off linearly with distance (400px falloff)
      const strength = Math.max(0, 1 - dist / 400) * 280;
      if (strength < 1) return;
      const angle = Math.atan2(dy, dx);
      t.ripple0Dx = Math.cos(angle) * strength;
      t.ripple0Dy = Math.sin(angle) * strength;
      t.rippleStart = now;
      t.rippleDuration = getRandomInt(700, 1600);
    });
  };

  // ── Animation loop ────────────────────────────────────────────────────────

  let _mouseX = null;
  let _mouseY = null;

  const _setMouse = (x, y) => { _mouseX = x; _mouseY = y; };
  const _clearMouse = () => { _mouseX = null; _mouseY = null; };

  const _loop = (now) => {
    engineId = requestAnimationFrame(_loop);
    if (now - lastFrameTime < frameMs) return;
    lastFrameTime = now;

    if (!startTime) startTime = now;
    _clearArtboard();
    _randomDrift(now);
    if (renderFn) renderFn(now, _mouseX, _mouseY);
  };

  const _start = () => {
    engineId = requestAnimationFrame(_loop);
  };

  const _kill = () => {
    cancelAnimationFrame(engineId);
    things = [];
    drifts = new Map();
    startTime = null;
  };

  const _init = (arr) => { things = arr; };
  const _defineAnimation = (fn) => { renderFn = fn; };

  return {
    clearArtboard: _clearArtboard,
    drawPlus: _drawPlus,
    init: _init,
    start: _start,
    kill: _kill,
    defineAnimation: _defineAnimation,
    drawFrame: _drawFrame,
    ripple: _ripple,
    setMouse: _setMouse,
    clearMouse: _clearMouse,
  };
};