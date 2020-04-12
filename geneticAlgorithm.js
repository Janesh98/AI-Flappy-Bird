function nextGeneration() {
    gen.update();
    fitness();

    for (let i = 0; i < TOTAL; i++) {
        birds[i] = evolve();
    }

    for (let i = 0; i < TOTAL; i++) {
        savedBirds[i].dispose();
    }
    savedBirds = [];
}

function evolve() {
    for (let i = 0; i < TOTAL; i++) {
        //let parentA = selection();
        return selection();
    }
}

function selection(parentA=null) {
    let index = 0;
    let r = random(1);
    while (r > 0) {
      r = r - savedBirds[index].fitness;
      index++;
    }
    index--;
    let bird = savedBirds[index];
    bird = new Bird(bird.brain);
    if (parentA) {
        bird.crossover(parentA);
    }
    bird.mutate();
    return bird;
}

function fitness() {
    let sum = 0;
    for (let bird of savedBirds) {
      sum += bird.score;
    }
    for (let bird of savedBirds) {
      bird.fitness = bird.score / sum;
    }
  }