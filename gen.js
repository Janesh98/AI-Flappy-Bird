class Gen {

    constructor() {
        this.generation = 1;
        this.y = height/6;
        this.x = width - this.y*2 - 50;
    }
  
    show() {
      fill(0, 255, 255);
      textSize(50);
      const s = "Gen: " + this.generation.toString();
      text(s, this.x, this.y);
    }
  
    update() {
      this.generation++;
    }

  }