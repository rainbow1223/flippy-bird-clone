import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 2400,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let bird = null;
let pipes = null;
const pipeVerticalDistanceRange = [150, 250];
const pipeHorizontalDistanceRange = [350, 500];
const PIPE_NUMBER = 4;
// const pipeVerticalPositionRange = [20, ]
// let pipeHorizontalDistance = 0;

const VELOCITY = 200;
const FLAP_VELOCITY = 250;
const initialBirdPosition = { x: config.width / 10, y: config.height / 2 };
// Loading assets, such as images, music, animations
function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

function create() {
  // this.add.image(config.width / 2, config.height / 2, 'sky')
  this.add.image(0, 0, "sky").setOrigin(0, 0);
  // this.add.image(0, 0, 'pipe').setOrigin(0, 0)
  // 1/10 width, in the half height bird
  bird = this.physics.add.sprite(
    initialBirdPosition.x,
    initialBirdPosition.y,
    "bird"
  );
  pipes = this.physics.add.group();
  for (let i = 0; i < PIPE_NUMBER; i++) {
    let upperPipe = pipes.create(0, 0, "pipe").setOrigin(0, 1);
    let lowerPipe = pipes.create(0, 0, "pipe").setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }
  pipes.setVelocityX(-200);
  // debugger
  // bird.body.velocity.x = VELOCITY;
  bird.body.gravity.y = 400;

  // bird.body.gravity.y = 200;
  this.input.keyboard.on("keydown_SPACE", function () {
    console.log("space down");
  });
  this.input.on("pointerdown", flap);
}

function update(time, delta) {
  // console.log(delta)
  if (bird.x >= config.width - bird.width) {
    bird.body.velocity.x = -VELOCITY;
  } else if (bird.x <= 0) {
    bird.body.velocity.x = VELOCITY;
  }

  if (bird.y >= config.height || bird.y < -bird.body.height) {
    resetBirdPosition();
  }
  recyclePipes();
}

function resetBirdPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}

function placePipe(uPipe, lPipe) {
  let pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);
  let rightMostX = getRightMostX();
  let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
  let pipeVeriticalPosition = Phaser.Math.Between(
    20,
    config.height - 20 - pipeVerticalDistance
  );
  uPipe.x = rightMostX + pipeHorizontalDistance;
  uPipe.y = pipeVeriticalPosition;
  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;
  // upperPipe = this.physics.add.sprite(pipeHorizontalDistance, pipeVeriticalPosition, 'pipe').setOrigin(0, 1)
  // lowerPipe = this.physics.add.sprite(upperPipe.x, upperPipe.y + pipeVerticalDistance, 'pipe').setOrigin(0, 0)
  // upperPipe.body.velocity.x = -200;
  // lowerPipe.body.velocity.x = -200;
}

function recyclePipes() {
  let tempPipes = [];
  pipes.getChildren().forEach(pipe => {
    if(pipe.getBounds().right <= 0) {
      tempPipes.push(pipe)
      if(tempPipes.length === 2) {
        console.log(tempPipes);
        placePipe(...tempPipes)
      }
    }
  })
}

function getRightMostX() {
  let rightMostX = 0;
  pipes.getChildren().forEach(function(pipe){
    rightMostX = Math.max(pipe.x, rightMostX)
  });
  console.log(rightMostX)
  return rightMostX;
}
function flap() {
  // console.log("space event happpend")
  bird.body.velocity.y = -FLAP_VELOCITY;
}

new Phaser.Game(config);
