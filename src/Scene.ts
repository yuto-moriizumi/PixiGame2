import UpdateObject from "./UpdateObject";
import * as PIXI from "pixi.js";
import Transition from "./Transition";
import Immediate from "./Immediate";
import LoaderAddParam from "./LoaderAddParam";
import GameManager from "./GameManager";
import Resource from "./Resources";
import UIGraph from "./UIGraph";
import UINodeFactory from "./UINodeFactory";
import Graph from "Graph";

export default abstract class Scene extends PIXI.Container {
  protected transitionIn: Transition = new Immediate();
  protected transitionOut: Transition = new Immediate();
  protected objectsToUpdate: UpdateObject[] = [];
  protected elapsedFrameCount: number = 0;
  /**
   * UiGraph でロードされた UI データ
   */
  protected uiGraph: { [key: string]: PIXI.Container } = {};
  /**
   * UiGraph でロードされた UI データを配置するための PIXI.Container
   * 描画順による前後関係を統制するために一つの Container にまとめる
   */
  protected uiGraphContainer: PIXI.Container = new PIXI.Container();

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

  //UI Graph意外に利用するリソースがある場合に派生クラスで実装する
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
        return new Promise(resolve => {
          const additionalAssets = this.onInitialResourceLoaded();
          this.loadAdditionalResource(additionalAssets, () => resolve());
        });
      })
      .then(() => {
        this.onAdditionalResourceLoaded();
        onLoaded();
        this.onResourceLoaded();
      });
  }

  //最初に、UIGraph情報とcreateInitialResourceListで指定されたリソースをダウンロードする
  protected loadInitialResource(onLoaded: () => void): void {
    const assets = this.createInitialResourceList();
    const name = Resource.SceneUIGraph(this);
    assets.push(name);
    GameManager.instance.game.loader
      .add(this.filterLoadedAssets(assets))
      .load(() => onLoaded());
  }

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

  //loadInitialResource完了時のコールバックメソッド
  //追加でロードしなければならないてくすちゃなどの情報を返す
  protected onInitialResourceLoaded(): string[] | LoaderAddParam[] {
    const additionalAssets = [];
    const name = Resource.SceneUIGraph(this);
    const UIGraph = GameManager.instance.game.loader.resources[name];
    for (const node of UIGraph.data.nodes) {
      if (node.type === "sprite")
        additionalAssets.push({
          name: node.params.textureName,
          url: node.params.url
        });
    }
    return additionalAssets;
  }

  //onInitialResourceLoadedで発生した追加のリソースをロードする
  protected loadAdditionalResource(
    assets: string[] | LoaderAddParam[],
    onLoaded: () => void
  ): void {
    GameManager.instance.game.loader
      .add(this.filterLoadedAssets(assets))
      .load(() => onLoaded());
  }

  //追加のリソースロード完了時のコールバック 何もしない
  protected onAdditionalResourceLoaded(): void {}

  //すべてのリソースロード処理完了時のコールバック
  protected onResourceLoaded(): void {
    const sceneUIGraphName = Resource.SceneUIGraph(this);
    const resources = GameManager.instance.game.loader.resources;
    const json = resources[sceneUIGraphName].data;
    this.prepareUIGraphContainer(resources[sceneUIGraphName].data);
    this.addChild(this.uiGraphContainer);
  }

  protected prepareUIGraphContainer(uiData: Graph): void {
    for (const nodeData of uiData.nodes) {
      let factory =
        UIGraph.getFactory(nodeData.type) ||
        this.getCustomUIGraphFactory(nodeData.type);
      if (!factory) continue;
      const node = factory.createUiNodeByGraphElement(nodeData);
      if (!node) continue;
      if (nodeData.events)
        factory.attachUIEventByGraphElement(nodeData.events, node, this);
      this.uiGraph[nodeData.id] = node;
      this.uiGraphContainer.addChild(node);
    }
  }

  protected getCustomUIGraphFactory(_type: string): UINodeFactory | null {
    return null;
  }
}
