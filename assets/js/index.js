'use strict';

(function () {
  var items = 160;
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var $c = Canyon(ctx);

  var create = function create() {
    $c.kill();
    $c.clearArtboard();
    var plusses = [];
    for (var i = 0; i < items; i++) {
      var x = getRandomInt(0, 800);
      var y = getRandomInt(0, 450);
      var size = getRandomInt(10, 35);
      var gray = getRandomInt(100, 200);
      var opacity = getRandomInt(25, 85) / 100;
      var rotation = getRandomInt(0, 360);
      var rpm = getRandomInt(0.5, 10);
      plusses.push({ params: [x, y, size, gray, opacity, rotation, rpm] });
    }
    plusses.forEach(function (plus) {
      return $c.drawPlus(plus.params[0], plus.params[1], plus.params[2], 'rgba(' + plus.params[3] + ', ' + plus.params[3] + ', ' + plus.params[3] + ' ,' + plus.params[4] + ')', plus.params[5]);
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

  console.info(windowWidth);

  if (windowWidth / windowHeight < ratio) {
    console.info('A');
    document.getElementById('canvas').style.width = windowHeight * ratio + 'px';
    document.getElementById('canvas').style.height = windowHeight + 'px';
  } else {
    console.info('B', windowHeight, windowHeight / ratio);
    document.getElementById('canvas').style.width = windowWidth + 'px';
    document.getElementById('canvas').style.height = windowWidth / ratio + 'px';
  }
}