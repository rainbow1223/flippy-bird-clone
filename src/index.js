import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 400
      },
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

let bird = null; 
const VELOCITY = 200; 
const FLAP_VELOCITY = 250; 
const initialBirdPosition = {x: config.width/10, y: config.height / 2}
// Loading assets, such as images, music, animations
function preload() {
  this.load.image('sky', "assets/sky.png")
  this.load.image('bird', 'assets/bird.png')
}

function create() {
  // this.add.image(config.width / 2, config.height / 2, 'sky')
  this.add.image(0, 0, 'sky').setOrigin(0, 0)
  // 1/10 width, in the half height bird
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird')
  // debugger
  bird.body.velocity.x = VELOCITY;
  // bird.body.gravity.y = 200;
  this.input.keyboard.on('keydown_SPACE', function() {
    console.log("space down")
  });
  this.input.on("pointerdown", flap)
}

function update(time, delta) {
  // console.log(delta)
  if (bird.x >= config.width - bird.width) {
    bird.body.velocity.x = -VELOCITY;
  }
  else if(bird.x <= 0){
    bird.body.velocity.x = VELOCITY
  }

  if(bird.y >= config.height || bird.y < -bird.body.height) {
    resetBirdPosition()
  }
 

}

function resetBirdPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}


function flap() {
  // console.log("space event happpend")
  bird.body.velocity.y = -FLAP_VELOCITY;
}
new Phaser.Game(config);