import * as PIXI from "pixi.js";
import GameManager from "./GameManager";
import TitleScene from "./TitleScene";
window.onload = () => {
  GameManager.start({
    glWidth: 1136,
    glHeight: 640,
    backgroundColor: 0x222222
  });
  GameManager.loadScene(new TitleScene());
};
