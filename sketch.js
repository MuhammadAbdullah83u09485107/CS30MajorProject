// CS 30 Angry Birds Major Project
// Muhammad Abdullah
// Date
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let bird;
let sling;
let ground;
let pigs = [];
let boxes = [];
let launched = false;

function setup() {
    createCanvas(800, 600);

    // Create the bird
    bird = new Sprite(200, 400, 30, 30);
    bird.shapeColor = color(255, 0, 0);

    // Create the sling
    sling = new Sprite(200, 400, 20, 10);
    sling.visible = false;

    // Create the ground
    ground = new Sprite(width / 2, height - 10, width, 20);
    ground.immovable = true;

    // Create pigs
    for (let i = 0; i < 3; i++) {
        let pig = new Sprite(600, 500 - i * 50, 40, 40);
        pig.shapeColor = color(0, 255, 0);
        pigs.push(pig);
    }

    // Create boxes
    for (let i = 0; i < 3; i++) {
        let box = new Sprite(650, 500 - i * 50, 50, 50);
        box.shapeColor = color(150);
        boxes.push(box);
    }
}

function draw() {
    background(200);

    if (mouseIsPressed && !launched) {
        bird.position.x = mouseX;
        bird.position.y = mouseY;
    }

    if (!mouseIsPressed && !launched && bird.position.x !== 200 && bird.position.y !== 400) {
        bird.velocity.x = (sling.position.x - bird.position.x) * 0.2;
        bird.velocity.y = (sling.position.y - bird.position.y) * 0.2;
        launched = true;
    }

    // Handle collisions
    bird.collide(ground);
    for (let box of boxes) {
        bird.collide(box);
        box.collide(ground);
    }
    for (let pig of pigs) {
        bird.collide(pig, destroyPig);
        pig.collide(ground);
    }

    drawSprites();
}

function destroyPig(bird, pig) {
    pig.remove();
}

function keyPressed() {
    if (key === 'R' || key === 'r') {
        resetGame();
    }
}

function resetGame() {
    bird.position.x = 200;
    bird.position.y = 400;
    bird.velocity.x = 0;
    bird.velocity.y = 0;
    launched = false;

    // Reset pigs
    pigs.forEach(pig => pig.remove());
    pigs = [];
    for (let i = 0; i < 3; i++) {
        let pig = createSprite(600, 500 - i * 50, 40, 40);
        pig.shapeColor = color(0, 255, 0);
        pigs.push(pig);
    }

    // Reset boxes
    boxes.forEach(box => box.remove());
    boxes = [];
    for (let i = 0; i < 3; i++) {
        let box = createSprite(650, 500 - i * 50, 50, 50);
        box.shapeColor = color(150);
        boxes.push(box);
    }
}