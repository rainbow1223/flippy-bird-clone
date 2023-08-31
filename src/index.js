import Phaser from "phaser";
import PlayerScene from "./scenes/PlayerScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";
import ScoreScene from "./scenes/ScoreScene";
import PauseScene from "./scenes/PauseScene";

const WIDTH = 400;
const HEIGHT = 600;
const BIRD_POSITION = {x: WIDTH * 0.1, y: HEIGHT / 2}
const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
}

const Scenes = [PreloadScene, MenuScene, PlayerScene, ScoreScene, PauseScene];
const createScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = () => Scenes.map(createScene)
const config = {
  type: Phaser.AUTO,
  pixelArt: true,
  ...SHARED_CONFIG,
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
    },
  },
  scene: initScenes()
};

// Loading assets, such as images, music, animations
function preload() {

}

function create() {

}

function update(time, delta) {
  // console.log(delta)
}

new Phaser.Game(config);
