import Phaser from "phaser";

const FLAP_VELOCITY = 300;
const PIPE_NUMBER = 4;
const pipeVerticalDistanceRange = [150, 250];
const pipeHorizontalDistanceRange = [350, 500];

class PlayerScene extends Phaser.Scene {
  constructor(config) {
    super("Play Scene");

    this.bird = null;
    this.pipes = null;
    this.config = config;
    this.score = 0;
    this.scoreText = '';
    this.bestScore = 0; 
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
    this.createScore();
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
  createScore() {
    this.score = 0;
    this.getBestScore();
    this.scoreText = this.add.text(16, 16, `Score: ${0}`, {fontSize: '32px', color: "#000"})
    this.bestScoreText = this.add.text(16, 50, `Best Score: ${this.bestScore}`, {fontSize: '16px', color: '#000'})
  }
  createBird() {
    this.bird = this.physics.add.sprite(
      this.config.startPosition.x,
      this.config.startPosition.y,
      "bird"
    );
    this.bird.body.gravity.y = 600;
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

  setBestScore() {
    if(!this.bestScore || this.score > this.bestScore) {
        this.bestScore = this.score; 
    }
  }

  getBestScore() {
    const bestScoreText = localStorage.getItem("bestScore");
    this.bestScore = bestScoreText && parseInt(bestScoreText, 10);
  }

  saveBestScore() {
    localStorage.setItem("bestScore", this.bestScore);
  }
  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xE48866)
    // this.bird.x = this.config.startPosition.x;
    // this.bird.y = this.config.startPosition.y;
    // this.bird.body.velocity.y = 0;
    this.setBestScore();
    this.saveBestScore();
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

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`)
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
        //   console.log(tempPipes);
          this.placePipe(...tempPipes);
          this.increaseScore();
        }
      }
    });
  }
}

export default PlayerScene;
