import BaseScene from "./BaseScene";

const FLAP_VELOCITY = 300;
const PIPE_NUMBER = 4;
// const pipeVerticalDistanceRange = [150, 250];
// const pipeHorizontalDistanceRange = [350, 500];

class PlayerScene extends BaseScene {
  constructor(config) {
    super("PlayerScene", config);
    this.isPaused = false;
    this.bird = null;
    this.pipes = null;
    this.config = config;
    this.score = 0;
    this.scoreText = "";
    this.bestScore = 0;
    this.currentDifficulty = 'easy';
    this.difficulties = {
      'easy': {
        pipeHorizontalDistanceRange: [300, 350],
        pipeVerticalDistanceRange: [150, 200]
      },
      'normal': {
        pipeHorizontalDistanceRange: [280, 330],
        pipeVerticalDistanceRange: [140, 190]
      },
      'hard': {
        pipeHorizontalDistanceRange: [250, 310],
        pipeVerticalDistanceRange: [70, 100]

      }
    }
  }

  create() {
    this.currentDifficulty = 'easy'
    super.create();
    this.createBird();
    this.createPipes();
    this.createPause();
    this.createColliders();
    this.createScore();
    this.handleInputs();
    this.listenToEvents();
    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers('bird', { start: 9, end: 15}),
      frameRate: 8,
      repeat: -1
    })
    this.bird.play('fly')
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }
  checkGameStatus() {
    if (
      this.bird.getBounds().bottom >= this.config.height ||
      this.bird.getBounds().top <= 0
    ) {
      this.gameOver();
    }
  }
  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }
  createScore() {
    this.score = 0;
    this.getBestScore();
    this.scoreText = this.add.text(16, 16, `Score: ${0}`, {
      fontSize: "32px",
      color: "#000",
    });
    this.bestScoreText = this.add.text(
      16,
      50,
      `Best Score: ${this.bestScore}`,
      { fontSize: "16px", color: "#000" }
    );
  }
  createBird() {
    this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird')
      .setFlipX(true)
      .setScale(3)
      .setOrigin(0);
    this.bird.setBodySize(this.bird.width, this.bird.height - 8);
    this.bird.body.gravity.y = 600;
    this.bird.body.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();
    for (let i = 0; i < PIPE_NUMBER; i++) {
      let upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      let lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
      
    }
    this.pipes.setVelocityX(-200);
  }

  createPause() {
    this.isPaused = false;
    const pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setInteractive()
      .setScale(3)
      .setOrigin(1);
    pauseButton.on("pointerdown", () => {
      this.isPaused = true
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("PauseScene");
    });
  }
  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  handleInputs() {
    this.input.on("pointerdown", this.flap, this);
  }

  setBestScore() {
    if (!this.bestScore || this.score > this.bestScore) {
      this.bestScore = this.score;
    }
  }

  getBestScore() {
    const bestScoreText = localStorage.getItem("bestScore");
    if (!this.bestScore) {
      this.bestScore = 0;
    }
    this.bestScore = bestScoreText && parseInt(bestScoreText, 10);
  }

  saveBestScore() {
    localStorage.setItem("bestScore", this.bestScore);
  }
  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xe48866);
    // this.bird.x = this.config.startPosition.x;
    // this.bird.y = this.config.startPosition.y;
    // this.bird.body.velocity.y = 0;
    this.setBestScore();
    this.saveBestScore();
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
    });
  }
  flap() {
    // console.log("space event happpend")
    if(this.isPaused) {return ;}
    this.bird.body.velocity.y = -FLAP_VELOCITY;
  }

  listenToEvents() {
    this.events.on('resume', () => {
      this.initialTime = 3;
      this.countDownText = this.add.text(...this.screenCenter, 'Fly in: ' + this.initialTime, this.fontOptions).setOrigin(0.5);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true
      })
    })
  }
  countDown() {
    this.initialTime--;
    this.countDownText.setText('Fly in: ' + this.initialTime);
    if (this.initialTime <= 0) {
      this.isPaused = false;
      this.countDownText.setText('');
      this.physics.resume();
      this.timedEvent.remove();

    }
  }
  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  placePipe(uPipe, lPipe) {
    const difficulty = this.difficulties[this.currentDifficulty];
    let pipeHorizontalDistance = Phaser.Math.Between(
      ...difficulty.pipeHorizontalDistanceRange
    );
    let rightMostX = this.getRightMostX();
    let pipeVerticalDistance = Phaser.Math.Between(
      ...difficulty.pipeVerticalDistanceRange
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
    // console.log(rightMostX);
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
          this.increaseDifficulty();
        }
      }
    });
  }

  increaseDifficulty() {
    if (this.score === 1) {
      this.currentDifficulty = 'normal';
    }

    if (this.score === 3) {
      this.currentDifficulty = 'hard';
    }
  }
}

export default PlayerScene;
