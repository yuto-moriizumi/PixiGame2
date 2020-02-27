import * as PIXI from "pixi.js";
import GameManager from "./GameManager";
import FirstScene from "./FirstScene";
window.onload = () => {
  GameManager.start({
    glWidth: 1136,
    glHeight: 640,
    backgroundColor: 0x222222
  });
  GameManager.loadScene(new FirstScene());
};
