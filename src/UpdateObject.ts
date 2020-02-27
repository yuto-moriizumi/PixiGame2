import * as PIXI from "pixi.js";
export default interface UpdateObject {
  isDestroyed(): boolean;
  update(dt: number): void;
}
