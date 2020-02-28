import UpdateObject from "./UpdateObject";
import * as PIXI from "pixi.js";
import Transition from "./Transition";
import Immediate from "./Immediate";
import LoaderAddParam from "./LoaderAddParam";
import GameManager from "./GameManager";

export default abstract class Scene extends PIXI.Container {
  protected transitionIn: Transition = new Immediate();
  protected transitionOut: Transition = new Immediate();
  protected objectsToUpdate: UpdateObject[] = [];
  protected elapsedFrameCount: number = 0;

  //メインループで更新処理を行うべきオブジェクトの登録
  protected registerUpdatingObject(object: UpdateObject): void {
    this.objectsToUpdate.push(object);
  }
  //registerUpdatingObjectで登録されたオブジェクトのフレーム更新
  protected updateRegisteredObjects(delta: number): void {
    const nextObjectToUpdate = [];
    for (const obj of this.objectsToUpdate) {
      if (!obj || obj.isDestroyed()) continue;
      obj.update(delta);
      nextObjectToUpdate.push(obj);
    }
    this.objectsToUpdate = nextObjectToUpdate;
  }
  //シーン開始トランジション（引数は終了時のコールバック）
  public beginTransitionIn(onTransitionFinished: (scene: Scene) => void): void {
    this.transitionIn.setCallback(() => {
      onTransitionFinished(this);
    });
    const container = this.transitionIn.getContainer();
    if (container) this.addChild(container);
    this.transitionIn.begin();
  }
  //シーン終了トランジション（引数は終了時コールバック
  public beginTransitionOut(
    onTransitionFinished: (scene: Scene) => void
  ): void {
    this.transitionOut.setCallback(() => {
      onTransitionFinished(this);
    });
    const container = this.transitionOut.getContainer();
    if (container) this.addChild(container);
    this.transitionOut.begin();
  }

  //GameManagerによって、requestAnimationFrame毎に呼び出されるメソッド
  public update(delta: number): void {
    this.elapsedFrameCount++;
    if (this.transitionIn.isActive()) {
      this.transitionIn.update(delta);
    } else if (this.transitionOut.isActive()) {
      this.transitionOut.update(delta);
    }
  }

  protected createInitialResourceList(): (LoaderAddParam | string)[] {
    //リソースリスト取得
    return [];
  }

  public beginLoadResource(onLoaded: () => void): Promise<void> {
    //リソースダウンロードのフローを実行する
    return new Promise(resolve => {
      this.loadInitialResource(() => resolve());
    })
      .then(() => {
        onLoaded();
      })
      .then(() => {
        this.onResourceLoaded();
      });
  }

  //最初に指定されたリソースをダウンロードする
  protected loadInitialResource(onLoaded: () => void): void {
    const assets = this.createInitialResourceList();
    const filteredAssets = this.filterLoadedAssets(assets);
    if (filteredAssets.length > 0) {
      GameManager.instance.game.loader
        .add(filteredAssets)
        .load(() => onLoaded());
    } else {
      onLoaded();
    }
  }

  //beginLoadResource完了時のコールバックメソッド
  protected onResourceLoaded(): void {}

  //渡されたアセットのリストから、ロード済みのものをフィルタリングする
  private filterLoadedAssets(
    assets: (LoaderAddParam | string)[]
  ): LoaderAddParam[] {
    const assetMap = new Map<string, LoaderAddParam>();
    const loader = GameManager.instance.game.loader;
    for (const asset of assets) {
      if (typeof asset === "string") {
        if (!loader.resources[asset] && !assetMap.has(asset)) {
          assetMap.set(asset, { name: asset, url: asset });
        }
      } else {
        if (!loader.resources[asset.name] && !assetMap.has(asset.name)) {
          assetMap.set(asset.name, asset);
        }
      }
    }
    return Array.from(assetMap.values());
  }
}
