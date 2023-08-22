import Phaser from "phaser";

const FLAP_VELOCITY = 200;
const PIPE_NUMBER = 4;
const pipeVerticalDistanceRange = [150, 250];
const pipeHorizontalDistanceRange = [350, 500];

class PlayerScene extends Phaser.Scene {
  constructor(config) {
    super("Play Scene");
    
    this.bird = null;
    this.pipes = null;
    this.config = config;
    
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
    // this.load.image("pipe", "assets/pipe.png");
    // this.add.image(0, 0, 'pipe').setOrigin(0, 0)
    // 1/10 width, in the half height bird
    this.bird = this.physics.add.sprite(
      this.config.startPosition.x,
      this.config.startPosition.y,
      "bird"
    );
    this.input.on("pointerdown", this.flap, this);
    this.bird.body.gravity.y = 400;

    this.pipes = this.physics.add.group();
    for (let i = 0; i < PIPE_NUMBER; i++) {
      let upperPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 1);
      let lowerPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }
    this.pipes.setVelocityX(-200);
  }

  update() {
    if (
      this.bird.y >= this.config.height ||
      this.bird.y < -this.bird.body.height
    ) {
      this.resetBirdPosition();
    }
    this.recyclePipes();
  }

  resetBirdPosition() {
    this.bird.x = this.config.startPosition.x;
    this.bird.y = this.config.startPosition.y;
    this.bird.body.velocity.y = 0;
  }
  flap() {
    // console.log("space event happpend")
    this.bird.body.velocity.y = -FLAP_VELOCITY;
  }

  placePipe(uPipe, lPipe) {
    let pipeHorizontalDistance = Phaser.Math.Between(
      ...pipeHorizontalDistanceRange
    );
    let rightMostX = this.getRightMostX();
    let pipeVerticalDistance = Phaser.Math.Between(
      ...pipeVerticalDistanceRange
    );
    let pipeVeriticalPosition = Phaser.Math.Between(
      20,
      this.config.height - 20 - pipeVerticalDistance
    );
    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVeriticalPosition;
    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }
  getRightMostX() {
    let rightMostX = 0;
    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    });
    console.log(rightMostX);
    return rightMostX;
  }

  recyclePipes() {
    let tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          console.log(tempPipes);
          this.placePipe(...tempPipes);
        }
      }
    });
  }
}

export default PlayerScene;
