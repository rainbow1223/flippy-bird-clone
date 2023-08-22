import Phaser from "phaser";
import PlayerScene from "./scenes/PlayerScene";


const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = {x: WIDTH * 0.1, y: HEIGHT / 2}
const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
}
const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [new PlayerScene(SHARED_CONFIG)],
};

const VELOCITY = 200;
const FLAP_VELOCITY = 250;
// Loading assets, such as images, music, animations
function preload() {

}

function create() {

}

function update(time, delta) {
  // console.log(delta)
}

new Phaser.Game(config);
