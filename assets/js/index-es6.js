(function() {
  const items = 160;
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const $c = Canyon(ctx);

  const create = () => {
    $c.kill();
    $c.clearArtboard();
    const plusses = [];
    for (let i = 0; i < items; i++) {
      const x = getRandomInt(0, 800);
      const y = getRandomInt(0, 450);
      const size = getRandomInt(10, 35);
      const gray = getRandomInt(100, 200);
      const opacity = getRandomInt(25, 85) / 100;
      const rotation = getRandomInt(0, 360);
      const rpm = getRandomInt(0.5, 10);
      plusses.push({params: [x, y, size, gray, opacity, rotation, rpm]});
    }
    plusses.forEach(plus => $c.drawPlus(plus.params[0], plus.params[1], plus.params[2],`rgba(${plus.params[3]}, ${plus.params[3]}, ${plus.params[3]} ,${plus.params[4]})`, plus.params[5]));

    $c.defineAnimation(() => {
      $c.clearArtboard();
      $c.init(plusses);
      $c.randomMovement();
      $c.moveCircular();
    });
    $c.start();
  }

  create();

  window.addEventListener('resize', setDimensions);

  document.getElementById('canvas').addEventListener('click', create);
  // document.getElementById('canvas').addEventListener('touch', create);

  setTimeout(setDimensions, 100);

})();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setDimensions() {
  const ratio = 80/45;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  console.info(windowWidth);

  if (windowWidth/windowHeight < ratio) {
    console.info('A');
    document.getElementById('canvas').style.width = `${windowHeight * ratio}px`;
    document.getElementById('canvas').style.height = `${windowHeight}px`;
  } else {
    console.info('B', windowHeight, windowHeight / ratio);
    document.getElementById('canvas').style.width = `${windowWidth}px`;
    document.getElementById('canvas').style.height = `${windowWidth / ratio}px`;
  }
}
