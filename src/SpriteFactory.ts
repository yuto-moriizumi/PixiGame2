import UINodeFactory from "./UINodeFactory";
import SpriteNodeParams from "./SpriteNodeParams";
import * as PIXI from "pixi.js";

export default class SpriteFactory extends UINodeFactory {
  public createUINode(nodeParams?: SpriteNodeParams): PIXI.Container | null {
    const sprite = new PIXI.Sprite();
    if (nodeParams) {
      const textureName = nodeParams.textureName;
      if (textureName && PIXI.utils.TextureCache[textureName])
        sprite.texture = PIXI.utils.TextureCache[textureName];
      if (nodeParams.anchor) {
        sprite.anchor.x = nodeParams.anchor[0];
        sprite.anchor.y = nodeParams.anchor[1];
      }
    }
    return sprite;
  }
}
