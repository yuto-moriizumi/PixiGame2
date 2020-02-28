import * as PIXI from "pixi.js";
import UINodeFactory from "./UINodeFactory";
import TextNodeParams from "./TextNodeParams";

export default class TextFactory extends UINodeFactory {
  public createUINode(nodeParams?: TextNodeParams): PIXI.Container | null {
    const textSyleParams: any = {};
    if (nodeParams) {
      if (nodeParams.family !== undefined)
        textSyleParams.family = nodeParams.family;
      if (nodeParams.size !== undefined) textSyleParams.size = nodeParams.size;
      if (nodeParams.color !== undefined)
        textSyleParams.color = nodeParams.color;
      if (nodeParams.padding !== undefined)
        textSyleParams.padding = nodeParams.padding;
    }
    const style = new PIXI.TextStyle(textSyleParams);
    const container = new PIXI.Text(
      nodeParams && nodeParams.text ? nodeParams.text : "NULL",
      style
    );
    if (nodeParams && nodeParams.anchor !== undefined)
      container.anchor.set(...nodeParams.anchor);
    return container;
  }
}
