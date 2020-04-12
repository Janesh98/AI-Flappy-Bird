class Bird {
  constructor(brain) {
    this.y = height / 2;
    this.x = 64;
    this.gravity = 0.8;
    this.lift = -12;
    this.velocity = 0;
    this.score = 0;
    this.fitness = 0;
    if (brain) {
      this.brain = brain.copy();
    }
    else {
      this.brain = new NeuralNetwork(5, 8, 2, brain);
    }
  }

  dispose() {
    this.brain.dispose();
  }

  crossover(parentA) {
    this.brain.crossover(parentA);
  }

  mutate() {
    this.brain.mutate(0.1);
  }

  show() {
    //stroke(255);
    fill(255, 50);
    image(avatar, this.x, this.y, 32, 32);
  }

  up() {
    this.velocity += this.lift;
  }

  offScreen() {
    return this.y > height || this.y < 0;
  }

  update() {
    this.score++;

    this.velocity += this.gravity;
    //this.velocity *= 0.9;
    this.y += this.velocity;
  }

  // decide whether to jump
  think(pipes) {
    // Find the closest pipe
    let closestPipe = null;
    let shortestDistance = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let distance = pipes[i].x + pipes[i].w - this.x;
      if (distance < shortestDistance && distance > 0) {
        closestPipe = pipes[i];
        shortestDistance = distance;
      }
    }
    // inputs for neural network
    let inputs = [];
    inputs[0] = this.y / height;
    inputs[1] = closestPipe.top / height;
    inputs[2] = closestPipe.bottom / height;
    inputs[3] = closestPipe.x / width;
    inputs[4] = this.velocity / 10;
    // get outputs of neural network
    let output = this.brain.predict(inputs);
    if (output[0] > output[1]) {
      this.up();
    }
  }
  
}
