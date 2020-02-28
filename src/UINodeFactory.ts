import NodeParams from "./NodeParams";
import Node from "./Node";
import * as PIXI from "pixi.js";
import Event from "./Event";

export default class UINodeFactory {
  //パラメータを加味しないUI要素を返す
  public createUiNode(params?: NodeParams): PIXI.Container | null {
    return new PIXI.Container();
  }
  //パラメータを加味したUI要素を返す
  public createUiNodeByGraphElement(nodeData: Node): PIXI.Container | null {
    const node = this.createUiNode(nodeData.params);
    if (node) {
      node.name = nodeData.id;
      node.position.set(nodeData.position[0], nodeData.position[1]);
    }
    return node;
  }

  public attachUIEventByGraphElement(
    events: Event[],
    node: PIXI.Container | null,
    target: any
  ): void {
    node.interactive = true;
    for (const event of events) {
      const fx = target[event.callback];
      if (!fx) continue;
      node.on(event.type, () => fx.call(target, ...event.arguments));
    }
  }
}
