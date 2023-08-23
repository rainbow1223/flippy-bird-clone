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
    this.createBG();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.handleInputs();
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }
  checkGameStatus() {
    if (this.bird.getBounds().bottom >= this.config.height || this.bird.getBounds().top <= 0) {
        this.gameOver();
      }
  }
  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }
  createBird() {
    this.bird = this.physics.add.sprite(
      this.config.startPosition.x,
      this.config.startPosition.y,
      "bird"
    );
    this.bird.body.gravity.y = 400;
    this.bird.body.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();
    for (let i = 0; i < PIPE_NUMBER; i++) {
      let upperPipe = this.pipes.create(0, 0, "pipe").setImmovable(true).setOrigin(0, 1);
      let lowerPipe = this.pipes.create(0, 0, "pipe").setImmovable(true).setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }
    this.pipes.setVelocityX(-200);
  }

  createColliders(){
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this)
  }

  handleInputs() {
    this.input.on("pointerdown", this.flap, this);
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xE48866)
    // this.bird.x = this.config.startPosition.x;
    // this.bird.y = this.config.startPosition.y;
    // this.bird.body.velocity.y = 0;
    this.time.addEvent({
        delay: 1000,
        callback: () => {
            this.scene.restart();
        }
    })
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
