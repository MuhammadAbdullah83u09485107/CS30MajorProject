// CS 30 Angry Birds Major Project
// Muhammad Abdullah
// Date
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let sprite;

function setup() {
  new Canvas(windowWidth, windowHeight);
}

function draw() {
  sprite = new Sprite();
  sprite.width = 50;
  sprite.height = 50;
}

function restartGame() {
}

 function howToPlayScreen() {

}

class Pigs {
  constructor (x, y) {
    this.x = width/2;
    this.y = height/2;
    this.speed = 5;
  }
}

class Birds {
  constructor (x, y) {
    this.x = width/4;
    this.y = height / 2;
    this.speed = 5;
    this.radius = 50;
  }
}

function useBird() {
}