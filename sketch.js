// CS 30 Angry Birds Major Project
// Muhammad Abdullah
// Date
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let birds = [];
let redBird, chuckBird, bombBird, matildaBird;
let currentBirdIndex = 0;
let sling, slingImage;
let ground;
let pigs = [];
let boxes = [];
let launched = false;
let boxImage, pigImage;
let birdTypes = ["Red", "Chuck", "Bomb", "Matilda"];
let gameState = "howToPlay";
let restartButton;
let score = 0;

function preload() {
    redBird = loadImage('redangrybird.webp');
    chuckBird = loadImage('fastangrybird.webp');
    bombBird = loadImage('angrybirdbomb.webp');
    matildaBird = loadImage('matildaangrybird.png');
    slingImage = loadImage('slingshotangrybirds.webp');
    boxImage = loadImage('woodblockangrybird.webp');
    pigImage = loadImage('pigangrybirds.webp');
}

function setup() {
    createCanvas(800, 600);
    createBirds();
    createEnvironment();
    restartButton = createButton('Restart');
    restartButton.position(width / 2 - 50, height / 2 + 50);
    restartButton.mousePressed(resetGame);
    restartButton.hide();
}

function draw() {
    background(200);
    if (gameState === "howToPlay") {
        drawHowToPlay();
    } else if (gameState === "playing") {
        drawGame();
    } else if (gameState === "gameOver") {
        drawGameOver();
    }
}

function drawHowToPlay() {
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text("How to Play", width / 2, height / 4);
    textSize(18);
    text("Drag the bird with your mouse and release to shoot.", width / 2, height / 3);
    text("Press 'R' to restart the game.", width / 2, height / 2.5);
    text("Press space to activate the bird's special power.", width / 2, height / 2.1);
    text("Click anywhere to start playing!", width / 2, height / 1.8);
    if (mouseIsPressed) {
        gameState = "playing";
    }
}

function drawGame() {
    image(slingImage, 180, 370, 50, 100);
    if (mouseIsPressed && !launched) {
        birds[currentBirdIndex].position.x = mouseX;
        birds[currentBirdIndex].position.y = mouseY;
    }
    if (!mouseIsPressed && !launched && birds[currentBirdIndex].position.x !== 200 && birds[currentBirdIndex].position.y !== 400) {
        let bird = birds[currentBirdIndex];
        let dx = sling.position.x - bird.position.x;
        let dy = sling.position.y - bird.position.y;
        bird.velocity.x = dx * 0.1;
        bird.velocity.y = dy * 0.1;
        launched = true;
    }
    birds[currentBirdIndex].collide(ground);
    for (let box of boxes) {
        birds[currentBirdIndex].collide(box);
        box.collide(ground);
    }
    for (let pig of pigs) {
        birds[currentBirdIndex].collide(pig, destroyPig);
        pig.collide(ground);
    }
    drawSprites();
    textSize(24);
    fill(0);
    text(`Score: ${score}`, width - 100, 50);
    if (currentBirdIndex >= birds.length - 1 && !launched) {
        gameState = "gameOver";
        restartButton.show();
    }
}

function drawGameOver() {
    fill(0);
    textSize(32);
    textAlign(CENTER);
    text("Game Over", width / 2, height / 3);
    textSize(24);
    text(`Final Score: ${score}`, width / 2, height / 2.5);
}

function createBirds() {
    for (let i = 0; i < birdTypes.length; i++) {
        let bird = createSprite(200, 400, 30, 30);
        switch (birdTypes[i]) {
            case "Red":
                bird.addImage(redBird);
                break;
            case "Chuck":
                bird.addImage(chuckBird);
                break;
            case "Bomb":
                bird.addImage(bombBird);
                break;
            case "Matilda":
                bird.addImage(matildaBird);
                break;
        }
        bird.type = birdTypes[i];
        birds.push(bird);
    }
}

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
    for (let i = 0; i < 3; i++) {
        let box = createSprite(650, 500 - i * 50, 50, 50);
        box.addImage(boxImage.get(0, 0, 50, 50));
        boxes.push(box);
    }
}

function destroyPig(bird, pig) {
    pig.remove();
    score += 10;
}

function keyPressed() {
    if (key === 'R' || key === 'r') {
        resetGame();
    } else if (key === ' ') {
        activatePower(birds[currentBirdIndex]);
    }
}

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

function bombExplosion(bird) {
    for (let pig of pigs) {
        if (dist(bird.position.x, bird.position.y, pig.position.x, pig.position.y) < 100) {
            pig.remove();
            score += 10;
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

function dropEgg(bird) {
    let egg = createSprite(bird.position.x, bird.position.y, 10, 20);
    egg.shapeColor = color(255, 255, 0);
    egg.velocity.y = 5;
    egg.immovable = true;
    egg.life = 50;
    egg.overlap(pigs, (e, pig) => {
        pig.remove();
        score += 10;
    });
    egg.overlap(boxes, (e, box) => box.remove());
}

function nextBird() {
    if (currentBirdIndex < birds.length - 1) {
        currentBirdIndex++;
        launched = false;
    } else {
        gameState = "gameOver";
        restartButton.show();
    }
}

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
        box.addImage(boxImage.get(0, 0, 50, 50));
        boxes.push(box);
    }
    gameState = "playing";
    restartButton.hide();
    score = 0;
}


let birds = [];
let redBird, chuckBird, bombBird, matildaBird;
let currentBirdIndex = 0;
let sling, slingImage;
let ground;
let pigs = [];
let boxes = [];
let launched = false;
let boxImage, pigImage;
let birdTypes = ["Red", "Chuck", "Bomb", "Matilda"];
let gameState = "howToPlay";
let restartButton;
let score = 0;

function preload() {
    redBird = loadImage('assets/redangrybird.webp');
    chuckBird = loadImage('assets/fastangrybird.webp');
    bombBird = loadImage('assets/angrybirdbomb.webp');
    matildaBird = loadImage('assets/matildaangrybird.png');
    slingImage = loadImage('assets/slingshotangrybirds.webp');
    boxImage = loadImage('assets/woodblockangrybird.webp');
    pigImage = loadImage('assets/pigangrybirds.webp');
}

function setup() {
    createCanvas(800, 600);
    createBirds();
    createEnvironment();
    restartButton = createButton('Restart');
    restartButton.position(width / 2 - 50, height / 2 + 50);
    restartButton.mousePressed(resetGame);
    restartButton.hide();
}

function draw() {
    background(200);
    if (gameState === "howToPlay") {
        drawHowToPlay();
    } else if (gameState === "playing") {
        drawGame();
    } else if (gameState === "gameOver") {
        drawGameOver();
    } else if (gameState === "win") {
        drawWin();
    }
}

function drawHowToPlay() {
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text("How to Play", width / 2, height / 4);
    textSize(18);
    text("Drag the bird with your mouse and release to shoot.", width / 2, height / 3);
    text("Press 'R' to restart the game.", width / 2, height / 2.5);
    text("Press space to activate the bird's special power.", width / 2, height / 2.1);
    text("Click anywhere to start playing!", width / 2, height / 1.8);
    if (mouseIsPressed) {
        gameState = "playing";
    }
}

function drawGame() {
    image(slingImage, 160, 370, 80, 100);
    if (mouseIsPressed && !launched) {
        birds[currentBirdIndex].position.x = mouseX;
        birds[currentBirdIndex].position.y = mouseY;
    }
    if (!mouseIsPressed && !launched && birds[currentBirdIndex].position.x !== 200 && birds[currentBirdIndex].position.y !== 400) {
        let bird = birds[currentBirdIndex];
        let dx = sling.position.x - bird.position.x;
        let dy = sling.position.y - bird.position.y;
        bird.velocity.x = dx * 0.05; // Half speed
        bird.velocity.y = dy * 0.05;
        launched = true;
    }
    birds[currentBirdIndex].collide(ground);
    for (let box of boxes) {
        birds[currentBirdIndex].collide(box);
        box.collide(ground);
    }
    for (let pig of pigs) {
        birds[currentBirdIndex].collide(pig, destroyPig);
        pig.collide(ground);
    }
    drawSprites();
    textSize(24);
    fill(0);
    text(`Score: ${score}`, width - 100, 50);

    if (pigs.length === 0) {
        gameState = "win";
        restartButton.show();
    }

    if (currentBirdIndex >= birds.length - 1 && !launched) {
        gameState = "gameOver";
        restartButton.show();
    }
}

function drawGameOver() {
    fill(0);
    textSize(32);
    textAlign(CENTER);
    text("Game Over", width / 2, height / 3);
    textSize(24);
    text(`Final Score: ${score}`, width / 2, height / 2.5);
}

function drawWin() {
    fill(0);
    textSize(32);
    textAlign(CENTER);
    text("You Win!", width / 2, height / 3);
    textSize(24);
    text(`Final Score: ${score}`, width / 2, height / 2.5);
}

function createBirds() {
    for (let i = 0; i < birdTypes.length; i++) {
        let bird = createSprite(200, 400, 30, 30);
        bird.scale = 0.5; // Reduce bird size
        switch (birdTypes[i]) {
            case "Red":
                bird.addImage(redBird);
                break;
            case "Chuck":
                bird.addImage(chuckBird);
                break;
            case "Bomb":
                bird.addImage(bombBird);
                break;
            case "Matilda":
                bird.addImage(matildaBird);
                break;
        }
        bird.type = birdTypes[i];
        birds.push(bird);
    }
}

function createEnvironment() {
    sling = createSprite(200, 400, 20, 10);
    sling.visible = false;
    ground = createSprite(width / 2, height - 10, width, 20);
    ground.immovable = true;
    for (let i = 0; i < 3; i++) {
        let pig = createSprite(600, 500 - i * 50, 40, 40);
        pig.addImage(pigImage);
        pig.scale = 0.5; // Reduce pig size
        pigs.push(pig);
    }
    for (let i = 0; i < 3; i++) {
        let box = createSprite(650, 500 - i * 50, 50, 50);
        box.addImage(boxImage.get(0, 0, 50, 50));
        box.scale = 0.5; // Reduce box size
        boxes.push(box);
    }
}

function destroyPig(bird, pig) {
    pig.remove();
    score += 10;
}

function keyPressed() {
    if (key === 'R' || key === 'r') {
        resetGame();
    } else if (key === ' ') {
        activatePower(birds[currentBirdIndex]);
    }
}

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

function bombExplosion(bird) {
    for (let pig of pigs) {
        if (dist(bird.position.x, bird.position.y, pig.position.x, pig.position.y) < 100) {
            pig.remove();
            score += 10;
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

function dropEgg(bird) {
    let egg = createSprite(bird.position.x, bird.position.y, 10, 20);
    egg.shapeColor = color(255, 255, 0);
    egg.velocity.y = 5;
    egg.immovable = true;
    egg.life = 50;
    egg.overlap(pigs, (e, pig) => {
        pig.remove();
        score += 10;
    });
    egg.overlap(boxes, (e, box) => box.remove());
}

function nextBird() {
    if (currentBirdIndex < birds.length - 1) {
        currentBirdIndex++;
        launched = false;
    } else {
        gameState = "gameOver";
        restartButton.show();
    }
}

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
        pig.scale = 0.5; // Reduce pig size
        pigs.push(pig);
    }
    boxes.forEach(box => box.remove());
    boxes = [];
    for (let i = 0; i < 3; i++) {
        let box = createSprite(650, 500 - i * 50, 50, 50);
        box.addImage(boxImage.get(0, 0, 50, 50));
        box.scale = 0.5; // Reduce box size
        boxes.push(box);
    }
    gameState = "playing";
    restartButton.hide();
    score = 0;
}
