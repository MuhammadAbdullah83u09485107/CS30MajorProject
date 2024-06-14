let birds = [];
let redBird, chuckBird, bombBird, matildaBird;
let currentBirdIndex = 0;
let sling, slingImage;
let ground;
let pigs = [];
let blocks = [];
let launched = false;
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
    pigImage = loadImage('assets/pigangrybirds.webp');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    world.gravity.y = 10; // Setting gravity for the physics world
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
    image(slingImage, 160, 370, 80, 100);
    if (mouseIsPressed && !launched && gameState === "playing") {
        birds[currentBirdIndex].position.x = mouseX;
        birds[currentBirdIndex].position.y = mouseY;
    }
    if (!mouseIsPressed && !launched && birds[currentBirdIndex].position.x !== 200 && birds[currentBirdIndex].position.y !== 400 && gameState === "playing") {
        let bird = birds[currentBirdIndex];
        let dx = sling.position.x - bird.position.x;
        let dy = sling.position.y - bird.position.y;
        bird.velocity.x = dx * 0.1;
        bird.velocity.y = dy * 0.1;
        launched = true;
    }
    birds[currentBirdIndex].collide(ground);
    for (let block of blocks) {
        birds[currentBirdIndex].collide(block);
        block.collide(ground);
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
        bird.scale = 0.2; // Smaller bird size
        bird.addCollider("dynamic"); // Add dynamic collider to birds
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
        bird.visible = false; // Make all birds invisible initially
        birds.push(bird);
    }
    birds[0].visible = true; // Only the first bird is visible initially
}

function createEnvironment() {
    sling = createSprite(200, 400, 20, 10);
    sling.visible = false;
    ground = createSprite(width / 2, height - 10, width, 20);
    ground.immovable = true;
    ground.addCollider("static"); // Add static collider to ground
    
    // Create structure for pigs
    let baseY = height - 50;
    let pigSize = 20;
    let blockSize = 50;
    
    // Bottom layer blocks
    for (let i = 0; i < 3; i++) {
        let block = createSprite(650 + i * blockSize, baseY, blockSize, blockSize / 5);
        block.shapeColor = color(165, 42, 42);
        block.addCollider("dynamic"); // Add dynamic collider to blocks
        blocks.push(block);
    }
    
    // Middle blocks and pigs
    for (let i = 0; i < 3; i++) {
        let block = createSprite(650 + i * blockSize, baseY - blockSize / 5, blockSize / 5, blockSize);
        block.shapeColor = color(165, 42, 42);
        block.addCollider("dynamic"); // Add dynamic collider to blocks
        blocks.push(block);
    }
    
    let pig1 = createSprite(700, baseY - blockSize / 5, pigSize, pigSize);
    pig1.addImage(pigImage);
    pig1.scale = 0.03;
    pig1.addCollider("dynamic"); // Add dynamic collider to pigs
    pigs.push(pig1);
    
    // Top blocks and pigs
    for (let i = 0; i < 3; i++) {
        let block = createSprite(650 + i * blockSize, baseY - blockSize - blockSize / 5, blockSize, blockSize / 5);
        block.shapeColor = color(165, 42, 42);
        block.addCollider("dynamic"); // Add dynamic collider to blocks
        blocks.push(block);
    }
    
    let pig2 = createSprite(675, baseY - blockSize - blockSize / 5, pigSize, pigSize);
    pig2.addImage(pigImage);
    pig2.scale = 0.03;
    pig2.addCollider("dynamic"); // Add dynamic collider to pigs
    pigs.push(pig2);
    
    let pig3 = createSprite(725, baseY - blockSize - blockSize / 5, pigSize, pigSize);
    pig3.addImage(pigImage);
    pig3.scale = 0.03;
    pig3.addCollider("dynamic"); // Add dynamic collider to pigs
    pigs.push(pig3);
    
    // Top most blocks
    for (let i = 0; i < 3; i++) {
        let block = createSprite(650 + i * blockSize, baseY - blockSize - blockSize / 5 - blockSize / 5, blockSize / 5, blockSize);
        block.shapeColor = color(165, 42, 42);
        block.addCollider("dynamic"); // Add dynamic collider to blocks
        blocks.push(block);
    }
    
    let pig4 = createSprite(700, baseY - blockSize - blockSize - blockSize / 5, pigSize, pigSize);
    pig4.addImage(pigImage);
    pig4.scale = 0.03;
    pig4.addCollider("dynamic"); // Add dynamic collider to pigs
    pigs.push(pig4);
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
    for (let block of blocks) {
        if (dist(bird.position.x,bird.position.y, block.position.x, block.position.y) < 100) {
            block.remove();
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
    egg.overlap(blocks, (e, block) => block.remove());
}

function nextBird() {
    if (currentBirdIndex < birds.length - 1) {
        birds[currentBirdIndex].visible = false;
        currentBirdIndex++;
        birds[currentBirdIndex].visible = true;
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
    blocks.forEach(block => block.remove());
    blocks = [];
    createEnvironment();
    gameState = "playing";
    restartButton.hide();
    score = 0;
}














