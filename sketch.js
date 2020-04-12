// browser-sync start --server -f -w

const TOTAL = 250;
let birds = [];
let savedBirds = [];
let pipes = [];
let counter = 0;
let slider;
let gen;

function preload() {
  backImg = loadImage('images/flappy-background.png');
  avatar = loadImage('images/bird.png');
}

function setup() {
  createCanvas(640, 480);
  slider = createSlider(1, 10, 1);
  tf.setBackend('cpu');
  gen = new Gen();
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }
}

function draw() {
  for (let n = 0; n < slider.value(); n++) {
    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;

    // update pipe speed
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();

      // delete birds that hit pipes
      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipes[i].hits(birds[j])) {
          savedBirds.push(birds.splice(j, 1)[0]);
        }
      }

      // delete offscreen pipes
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    // delete off screen birds
    for (let i = birds.length - 1; i >= 0; i--) {
      if (birds[i].offScreen()) {
        savedBirds.push(birds.splice(i, 1)[0]);
      }
    }

    for (let bird of birds) {
      // decide whether to jump
      bird.think(pipes);
      // update score and position
      bird.update();
    }

    if (birds.length === 0) {
      counter = 0;
      nextGeneration();
      pipes = [];
    }
  }

  // draw background
  background(backImg);

  // show current generation
  gen.show()

  // draw birds
  for (let bird of birds) {
      bird.show();
  }

  // draw pipes
  for (let pipe of pipes) {
    pipe.show();
  }
}
