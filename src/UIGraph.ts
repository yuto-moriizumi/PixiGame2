import UINodeFactory from "./UINodeFactory";
import TextFactory from "./TextFactory";
import SpriteFactory from "./SpriteFactory";

export default class UIGraph {
  //UINodeFactoryのキャッシュ
  private static cachedFactory: { [key: string]: UINodeFactory } = {};

  static getFactory(type: string): UINodeFactory | null {
    if (!UIGraph.cachedFactory[type]) {
      let Factory;
      switch (type) {
        case "text":
          Factory = TextFactory;
          break;
        case "sprite":
          Factory = SpriteFactory;
          break;
      }
      if (!Factory) return null;
      UIGraph.cachedFactory[type] = new Factory();
    }
    return UIGraph.cachedFactory[type];
  }
}
