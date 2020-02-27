import UpdateObject from "./UpdateObject";
import * as PIXI from "pixi.js";
export default abstract class Scene extends PIXI.Container {
  public update(delta: number): void {
    this.updateRegisteredObjects(delta);
  }

  //メインループで更新処理を行うべきオブジェクトの登録
  protected registerUpdatingObject(object: UpdateObject): void {}
  //registerUpdatingObjectで登録されたオブジェクトのフレーム更新
  protected updateRegisteredObjects(delta: number): void {}
  //シーン開始トランジション（引数は終了時のコールバック）
  public beginTransitionIn(onTransitionFinished: (scene: Scene) => void): void {
    onTransitionFinished(this);
  }
  //シーン終了トランジション（引数は終了時コールバック
  public beginTransitionOut(
    onTransitionFinished: (scene: Scene) => void
  ): void {
    onTransitionFinished(this);
  }
}
