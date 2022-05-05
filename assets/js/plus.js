"use strict";

// shim layer with setTimeout fallback
window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
}();

window.cancelAnimationFrame = function () {
  return window.cancelAnimationFrame || window.mozCancelAnimationFrame;
}();

const Canyon = ctx => {
  let render;
  let startTime;
  let engine;
  let things = [];
  let moving = [];

  const _clearArtboard = () => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const _init = arr => {
    if (!things.length) {
      things = arr;
    }
  };

  const _drawPlus = (x, y, size, color, deg) => {
    const gW = size / 3; // gridWidth

    const offset = size / -2;
    const rotation = Math.PI * deg / 180;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.translate(x + gW, y); // ctx.moveTo(-gW * 1.5, -gW * 1.5)

    ctx.rotate(rotation);
    ctx.lineTo(gW * 2 + offset, 0 + offset);
    ctx.lineTo(gW * 2 + offset, gW + offset);
    ctx.lineTo(gW * 3 + offset, gW + offset);
    ctx.lineTo(gW * 3 + offset, gW * 2 + offset);
    ctx.lineTo(gW * 2 + offset, gW * 2 + offset);
    ctx.lineTo(gW * 2 + offset, gW * 3 + offset);
    ctx.lineTo(gW + offset, gW * 3 + offset);
    ctx.lineTo(gW + offset, gW * 2 + offset);
    ctx.lineTo(0 + offset, gW * 2 + offset);
    ctx.lineTo(0 + offset, gW + offset);
    ctx.lineTo(gW + offset, gW + offset);
    ctx.lineTo(gW + offset, 0 + offset);
    ctx.fill();
    ctx.restore();
  };

  const _moveCircular = () => {
    const now = new Date();
    const duration = now - startTime;
    things.forEach((thing, i) => {
      let xOffset = 0;
      let yOffset = 0;
      const moversFiltered = moving.filter(mover => mover.i === i);

      if (moversFiltered.length) {
        const mover = moversFiltered[0];
        const progress = (now - mover.start) / mover.duration;
        xOffset = mover.x * EasingFunctions.easeInOutQuint(progress);
        yOffset = mover.y * EasingFunctions.easeInOutQuint(progress);
      }

      const rotationOffset = duration / 1000 % thing.params[6] / thing.params[6] * 360 + thing.params[5];

      _drawPlus(thing.params[0] + xOffset, thing.params[1] + yOffset, thing.params[2], `rgba(
          ${Math.max(Math.min(thing.params[3] + (.1 * i - 50), 255), 0)},
          ${Math.max(Math.min(thing.params[3] + (1.5 * i - 50), 255), 0)},
          ${Math.max(Math.min(thing.params[3] + (i - 50), 255), 0)},
          ${thing.params[4]}
        )`, rotationOffset);
    });
  };

  const _randomMovement = () => {
    if (getRandomInt(0, 100) < 1) {
      const i = getRandomInt(0, things.length);

      if (moving.indexOf(i) < 0) {
        moving.push({
          start: new Date(),
          i: i,
          x: getRandomInt(10, 200) - 100,
          y: getRandomInt(10, 200) - 100,
          duration: getRandomInt(500, 3000)
        });
      }
    }

    moving = moving.filter(mover => {
      if (new Date() - mover.start > mover.duration) {
        things = things.map((thing, j) => {
          if (j === mover.i) {
            return {
              params: [thing.params[0] + mover.x, thing.params[1] + mover.y, thing.params[2], thing.params[3], thing.params[4], thing.params[5], thing.params[6]]
            };
          }

          return thing;
        });
        return false;
      }

      return true;
    });
  };

  const _defineAnimation = fn => {
    render = fn;
  };

  const _start = () => {
    if (!startTime) {
      startTime = new Date();
    }

    engine = requestAnimFrame(_start);

    if (render) {
      render();
    }
  };

  const _kill = () => {
    things = [];
    cancelAnimationFrame(engine);
  };

  return {
    clearArtboard: _clearArtboard,
    drawPlus: _drawPlus,
    init: _init,
    start: _start,
    kill: _kill,
    defineAnimation: _defineAnimation,
    moveCircular: _moveCircular,
    randomMovement: _randomMovement
  };
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */


const EasingFunctions = {
  // no easing, no acceleration
  linear: function (t) {
    return t;
  },
  // accelerating from zero velocity
  easeInQuad: function (t) {
    return t * t;
  },
  // decelerating to zero velocity
  easeOutQuad: function (t) {
    return t * (2 - t);
  },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  // accelerating from zero velocity 
  easeInCubic: function (t) {
    return t * t * t;
  },
  // decelerating to zero velocity 
  easeOutCubic: function (t) {
    return --t * t * t + 1;
  },
  // acceleration until halfway, then deceleration 
  easeInOutCubic: function (t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  // accelerating from zero velocity 
  easeInQuart: function (t) {
    return t * t * t * t;
  },
  // decelerating to zero velocity 
  easeOutQuart: function (t) {
    return 1 - --t * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) {
    return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },
  // accelerating from zero velocity
  easeInQuint: function (t) {
    return t * t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuint: function (t) {
    return 1 + --t * t * t * t * t;
  },
  // acceleration until halfway, then deceleration 
  easeInOutQuint: function (t) {
    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  }
};