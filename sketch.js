// CS 30 Angry Birds Major Project
// Muhammad Abdullah
// Date
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// 




let birds = [];
let birdImages = {};
let currentBirdIndex = 0;
let sling, slingImage;
let ground;
let pigs = [];
let boxes = [];
let launched = false;
let boxImage, pigImage;
let birdTypes = ["Red", "Chuck", "Bomb", "Matilda"];

function preload() {
    // Load bird images
    birdImages["Red"] = loadImage('redangrybird.webp'); // Red bird image
    birdImages["Chuck"] = loadImage('fastangrybird.webp'); // Chuck bird image
    birdImages["Bomb"] = loadImage('angrybirdbomb.webp'); // Bomb bird image
    birdImages["Matilda"] = loadImage('matildaangrybird.png'); // Matilda bird image
    slingImage = loadImage('slingshotangrybirds.webp'); // Slingshot image
    boxImage = loadImage('woodblockangrybird.webp'); // Box texture image
    pigImage = loadImage('pigangrybirds.webp'); // Pig image
}

function setup() {
    createCanvas(800, 600);

    createBirds(); // Initialize birds
    createEnvironment(); // Setup the environment (ground, pigs, boxes)
}

function draw() {
    background(200);

    // Draw the slingshot
    image(slingImage, 180, 370, 50, 100); // Adjust the position and size as needed

    // Drag the bird with the mouse before launch
    if (mouseIsPressed && !launched) {
        birds[currentBirdIndex].position.x = mouseX;
        birds[currentBirdIndex].position.y = mouseY;
    }

    // Launch the bird when the mouse is released
    if (!mouseIsPressed && !launched && birds[currentBirdIndex].position.x !== 200 && birds[currentBirdIndex].position.y !== 400) {
        let bird = birds[currentBirdIndex];
        bird.velocity.x = (sling.position.x - bird.position.x) * 0.2;
        bird.velocity.y = (sling.position.y - bird.position.y) * 0.2;
        launched = true;
    }

    // Handle collisions
    birds[currentBirdIndex].collide(ground);
    for (let box of boxes) {
        birds[currentBirdIndex].collide(box);
        box.collide(ground);
    }
    for (let pig of pigs) {
        birds[currentBirdIndex].collide(pig, destroyPig);
        pig.collide(ground);
    }

    drawSprites(); // Draw all sprites
}

// Create birds with different types
function createBirds() {
    for (let i = 0; i < birdTypes.length; i++) {
        let bird = createSprite(200, 400, 30, 30);
        bird.addImage(birdImages[birdTypes[i]]);
        bird.type = birdTypes[i];
        birds.push(bird);
    }
}

// Create the environment including sling, ground, pigs, and boxes
function createEnvironment() {
    sling = createSprite(200, 400, 20, 10);
    sling.visible = false;

    ground = createSprite(width / 2, height - 10, width, 20);
    ground.immovable = true;

    for (let i = 0; i < 3; i++) {
        let pig = createSprite(600, 500 - i * 50, 40, 40);
        pig.addImage(pigImage);
        pigs.push(pig);
    }

    // Create boxes with different shapes
    for (let i = 0; i < 3; i++) {
        let box = createSprite(650, 500 - i * 50, 50, 50);
        box.addImage(boxImage.get(0, 0, 50, 50)); // Assuming 50x50 is the size of the square block
        boxes.push(box);
    }
}

// Destroy pig when hit by the bird
function destroyPig(bird, pig) {
    pig.remove();
}

// Handle key presses
function keyPressed() {
    if (key === 'R' || key === 'r') {
        resetGame(); // Reset the game when 'R' is pressed
    } else if (key === ' ') {
        activatePower(birds[currentBirdIndex]); // Activate bird's power when space is pressed
    }
}

// Activate the special power of the current bird
function activatePower(bird) {
    switch (bird.type) {
        case "Chuck":
            bird.velocity.x *= 2;
            bird.velocity.y *= 2;
            break;
        case "Bomb":
            bombExplosion(bird);
            break;
        case "Matilda":
            dropEgg(bird);
            break;
    }
}

// Bomb's power: Explosion destroying nearby pigs and boxes
function bombExplosion(bird) {
    for (let pig of pigs) {
        if (dist(bird.position.x, bird.position.y, pig.position.x, pig.position.y) < 100) {
            pig.remove();
        }
    }
    for (let box of boxes) {
        if (dist(bird.position.x, bird.position.y, box.position.x, box.position.y) < 100) {
            box.remove();
        }
    }
    bird.remove();
    nextBird();
}

// Matilda's power: Drop an egg that destroys objects below
function dropEgg(bird) {
    let egg = createSprite(bird.position.x, bird.position.y, 10, 20);
    egg.shapeColor = color(255, 255, 0);
    egg.velocity.y = 5;
    egg.immovable = true;
    egg.life = 50;

    egg.overlap(pigs, (e, pig) => pig.remove());
    egg.overlap(boxes, (e, box) => box.remove());
}

// Switch to the next bird in the list
function nextBird() {
    if (currentBirdIndex < birds.length - 1) {
        currentBirdIndex++;
        launched = false;
    }
}

// Reset the game to the initial state
function resetGame() {
    birds.forEach(bird => bird.remove());
    birds = [];
    currentBirdIndex = 0;
    launched = false;
    createBirds();

    pigs.forEach(pig => pig.remove());
    pigs = [];
    for (let i = 0; i < 3; i++) {
        let pig = createSprite(600, 500 - i * 50, 40, 40);
        pig.addImage(pigImage);
        pigs.push(pig);
    }

    boxes.forEach(box => box.remove());
    boxes = [];
    for (let i = 0; i < 3; i++) {
        let box = createSprite(650, 500 - i * 50, 50, 50);
        box.addImage(boxImage.get(0, 0, 50, 50)); // Assuming 50x50 is the size of the square block
        boxes.push(box);
    }
}
