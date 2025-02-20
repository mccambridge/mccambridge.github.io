'use strict';

(function () {
  var items = 160;
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var $c = Canyon(ctx);

  var create = function create() {
    $c.kill();
    $c.clearArtboard();
    var plusses = [
      {
        params: [
          getRandomInt(0, 800),
          getRandomInt(0, 450),
          80,
          [30, 255, 250],
          0.65,
          getRandomInt(0, 360),
          getRandomInt(0.5, 10)
        ]
      },
      {
        params: [
          getRandomInt(0, 800),
          getRandomInt(0, 450),
          40,
          [200, 50, 50],
          0.5,
          getRandomInt(0, 360),
          getRandomInt(0.5, 10)
        ]
      },
    ];
    for (var i = 0; i < items; i++) {
      var x = getRandomInt(0, 800);
      var y = getRandomInt(0, 450);
      var size = getRandomInt(6, 35);
      var red = getRandomInt(50, 120);
      var green = getRandomInt(100, 200);
      var blue = getRandomInt(100, 220);
      var opacity = size < 34 ? size * 1.5 / 100 : 0.66;
      var rotation = getRandomInt(0, 360);
      var rpm = getRandomInt(0.5, 10);
      plusses.push({ params: [x, y, size, [red, green, blue], opacity, rotation, rpm] });
    }
    plusses.forEach(function (plus) {
      return $c.drawPlus(plus.params[0], plus.params[1], plus.params[2], 'rgba(' + plus.params[3][0] + ', ' + plus.params[3][1] + ', ' + plus.params[3][2] + ' ,' + plus.params[4] + ')', plus.params[5]);
    });

    $c.defineAnimation(function () {
      $c.clearArtboard();
      $c.init(plusses);
      $c.randomMovement();
      $c.moveCircular();
    });
    $c.start();
  };

  create();

  window.addEventListener('resize', setDimensions);

  document.body.addEventListener('click', create);
  // document.getElementById('canvas').addEventListener('touch', create);

  setTimeout(setDimensions, 100);
})();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setDimensions() {
  var ratio = 80 / 45;
  var windowWidth = document.documentElement.clientWidth;
  var windowHeight = document.documentElement.clientHeight;

  if (windowWidth / windowHeight < ratio) {
    document.getElementById('canvas').style.width = windowHeight * ratio + 'px';
    document.getElementById('canvas').style.height = windowHeight + 'px';
  } else {
    document.getElementById('canvas').style.width = windowWidth + 'px';
    document.getElementById('canvas').style.height = windowWidth / ratio + 'px';
  }
}