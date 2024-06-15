





let birds = [];
let birdImages = {};
let currentBirdIndex = 0;
let sling, slingImage;
let ground;
let pigs = [];
let blocks = [];
let launched = false;
let birdTypes = ["red", "chuck", "bomb", "matilda"];
let gameState = "howToPlay";
let restartButton;
let score = 0;
let slingPosition = { x: 200, y: 400 };
let slingRadius = 100;

function preload() {
  birdImages["red"] = loadImage("assets/redangrybird.webp");
  birdImages["chuck"] = loadImage("assets/fastangrybird.webp");
  birdImages["bomb"] = loadImage("assets/angrybirdbomb.webp");
  birdImages["matilda"] = loadImage("assets/matildaangrybird.png");
  slingImage = loadImage("assets/slingshotangrybirds.webp");
  pigImage = loadImage("assets/pigangrybirds.webp");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  createBirds();
  createEnvironment();
  restartButton = createButton("Restart");
  restartButton.position(width / 2 - 50, height / 2 + 50);
  restartButton.mousePressed(resetGame);
  restartButton.hide();
  console.log("Setup complete.");
}

function draw() {
  background(200);
  if (gameState === "howToPlay") {
    drawHowToPlay();
  } else if (gameState === "playing") {
    drawGame();
  } else if (gameState === "waiting") {
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
    let bird = birds[currentBirdIndex];
    

    if (!launched) {
        bird.x = slingPosition.x;
        bird.y = slingPosition.y;

        if (mouseIsPressed) {

            bird.collider = 'dynamic'; // Keep the bird static while dragging
            gameState = 'playing'
          let dx = mouseX - slingPosition.x;
          let dy = mouseY - slingPosition.y;

          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < slingRadius) {

            bird.x = mouseX;
            bird.y = mouseY;

        } else {
            bird.x = slingPosition.x + (dx / distance) * slingRadius;
            bird.y = slingPosition.y + (dy / distance) * slingRadius;

        }
        } else if (!mouseIsPressed && gameState === "playing") {
       
          let dx = slingPosition.x - mouseX;
          let dy = slingPosition.y - mouseY;
          bird.velocity.x = dx * 0.2;
          bird.velocity.y = dy * 0.2;
          console.log("let go of mouse: ", dx, dy, slingPosition, bird.x, bird.y, bird.velocity.x, bird.velocity.y)

          launched = true;
          bird.collider = "dynamic";
        }
      } else {
        console.log('bird moving ', )

        bird.velocity.x += 0.1; // TODO this should be dynamic but the bird positon isnt being updated for some whack reason
      }
  

    if (launched && bird.collides(ground)) {
      bird.velocity.x = 0;
      bird.velocity.y = 0;
      console.log('bird hit ground go to next bird')
      nextBird();
    }
   
    
    if (
      launched &&
      (bird.x < 0 || bird.x > width || bird.y > height)
    ) {
      nextBird();
    }
  
    
  
    for (let block of blocks) {
      block.collides(ground);
    }
    for (let pig of pigs) {
      bird.overlap(pig, destroyPig); // Check for collision with pig
      pig.collides(ground);
    }
  
    drawSprites();
  
    textSize(24);
    fill(0);
    text(`Score: ${score}`, width - 100, 50);
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
    bird.addImage(birdImages[birdTypes[i]]); // Add image based on bird type
    bird.type = birdTypes[i];
    bird.visible = false; // Make all birds invisible initially
    bird.velocity.x = 0; // Set initial velocity to zero
    bird.velocity.y = 0; // Set initial velocity to zero
    bird.collider = 'static'; // Custom property to manage static state
    birds.push(bird);
  }
  birds[0].visible = true; // Only the first bird is visible initially
  console.log("Birds created:", birds);
}

function createEnvironment() {
  sling = createSprite(slingPosition.x, slingPosition.y, 20, 10);
  sling.visible = false;
  //ground = createSprite(width / 2, height - 10, width, 20);
  ground = new Sprite(width / 2, height - 10, width, 20);
  ground.collider = 'static';
  ground.immovable = true;

  world.gravity.y = 5
  // Create structure for pigs
  let baseY = height - 50;
  let pigSize = 20;
  let blockSize = 50;

  // Bottom layer blocks
  for (let i = 0; i < 3; i++) {
    let block = createSprite(
      650 + i * blockSize,
      baseY,
      blockSize,
      blockSize / 5
    );
    block.shapeColor = color(165, 42, 42);
    block.velocity.x = 0; // Set initial velocity to zero
    block.velocity.y = 0; // Set initial velocity to zero
    block.collider = 'static'; // Custom property to manage static state
    blocks.push(block);
  }

  // Middle blocks and pigs
  for (let i = 0; i < 3; i++) {
    let block = createSprite(
      650 + i * blockSize,
      baseY - blockSize / 5,
      blockSize / 5,
      blockSize
    );
    block.shapeColor = color(165, 42, 42);
    block.velocity.x = 0; // Set initial velocity to zero
    block.velocity.y = 0; // Set initial velocity to zero
    block.collider = 'static'; // Custom property to manage static state
    blocks.push(block);
  }

  let pig1 = createSprite(700, baseY - blockSize / 5, pigSize, pigSize);
  pig1.addImage(pigImage);
  pig1.scale = 0.03;
  pig1.velocity.x = 0; // Set initial velocity to zero
  pig1.velocity.y = 0; // Set initial velocity to zero
  pig1.collider = 'static'; // Custom property to manage static state
  pigs.push(pig1);

  // Top blocks and pigs
  for (let i = 0; i < 3; i++) {
    let block = createSprite(
      650 + i * blockSize,
      baseY - blockSize - blockSize / 5,
      blockSize,
      blockSize / 5
    );
    block.shapeColor = color(165, 42, 42);
    block.velocity.x = 0; // Set initial velocity to zero
    block.velocity.y = 0; // Set initial velocity to zero
    block.collider = 'static'; // Custom property to manage static state
    blocks.push(block);
  }

  let pig2 = createSprite(
    675,
    baseY - blockSize - blockSize / 5,
    pigSize,
    pigSize
  );
  pig2.addImage(pigImage);
  pig2.scale = 0.03;
  pig2.velocity.x = 0; // Set initial velocity to zero
  pig2.velocity.y = 0; // Set initial velocity to zero
  pig2.collider = 'static'; // Custom property to manage static state
  pigs.push(pig2);

  let pig3 = createSprite(
    725,
    baseY - blockSize - blockSize / 5,
    pigSize,
    pigSize
  );
  pig3.addImage(pigImage);
  pig3.scale = 0.03;
  pig3.velocity.x = 0; // Set initial velocity to zero
  pig3.velocity.y = 0; // Set initial velocity to zero
  pig3.collider = 'static'; // Custom property to manage static state
  pigs.push(pig3);

  // Top most blocks
  for (let i = 0; i < 3; i++) {
    let block = createSprite(
      650 + i * blockSize,
      baseY - blockSize - blockSize / 5 - blockSize / 5,
      blockSize / 5,
      blockSize
    );
    block.shapeColor = color(165, 42, 42);
    block.velocity.x = 0; // Set initial velocity to zero
    block.velocity.y = 0; // Set initial velocity to zero
    block.collider = 'static'; // Custom property to manage static state
    blocks.push(block);
  }

  let pig4 = createSprite(
    700,
    baseY - blockSize - blockSize - blockSize / 5,
    pigSize,
    pigSize
  );
  pig4.addImage(pigImage);
  pig4.scale = 0.03;
  pig4.velocity.x = 0; // Set initial velocity to zero
  pig4.velocity.y = 0; // Set initial velocity to zero
  pig4.collider = 'static'; // Custom property to manage static state
  pigs.push(pig4);
}

function destroyPig(bird, pig) {
  pig.remove();
  score += 10;
  console.log("Pig hit! Score: " + score);
}

function keyPressed() {
  if (key === "R" || key === "r") {
    resetGame();
  } else if (key === " ") {
    activatePower(birds[currentBirdIndex]);
  }
}

function activatePower(bird) {
  switch (bird.type) {
    case "chuck":
      bird.velocity.x *= 2;
      bird.velocity.y *= 2;
      break;
    case "bomb":
      bombExplosion(bird);
      break;
    case "matilda":
      dropEgg(bird);
      break;
  }
}

function bombExplosion(bird) {
  for (let pig of pigs) {
    if (
      dist(bird.x, bird.y, pig.position.x, pig.position.y) <
      100
    ) {
      pig.remove();
      score += 10;
    }
  }
  for (let block of blocks) {
    if (
      dist(
        bird.x,
        bird.y,
        block.position.x,
        block.position.y
      ) < 100
    ) {
      block.remove();
    }
  }
  bird.remove();
  nextBird();
}

function dropEgg(bird) {
  let egg = createSprite(bird.x, bird.y, 10, 20);
  egg.shapeColor = color(255, 255, 0);
  egg.velocity.y = 5;
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
    birds[currentBirdIndex].collider = 'static';
    // birds[currentBirdIndex].position.x = 0;
    // birds[currentBirdIndex].position.y = 0;
    // birds[currentBirdIndex].velocity.x = 0;
    // birds[currentBirdIndex].velocity.y = 0;

    currentBirdIndex++;

    birds[currentBirdIndex].visible = true;
    birds[currentBirdIndex].position.x = slingPosition.x;
    birds[currentBirdIndex].position.y = slingPosition.y;
    birds[currentBirdIndex].velocity.x = 0;
    birds[currentBirdIndex].velocity.y = 0;
    birds[currentBirdIndex].collider = 'static';
    launched = false;
    gameState = "waiting";

  } else {
    gameState = "gameOver";
    restartButton.show();
  }
}

function resetGame() {
  birds.forEach((bird) => bird.remove());
  birds = [];
  currentBirdIndex = 0;
  launched = false;
  createBirds();
  pigs.forEach((pig) => pig.remove());
  pigs = [];
  blocks.forEach((block) => block.remove());
  blocks = [];
  createEnvironment();
  gameState = "playing";
  restartButton.hide();
  score = 0;
  console.log("Game reset. Birds after creation:", birds);
}


