import UpdateObject from "./UpdateObject";
import * as PIXI from "pixi.js";
import Transition from "./Transition";
import LoaderAddParam from "./LoaderAddParam";
export default abstract class Scene extends PIXI.Container {
    protected transitionIn: Transition;
    protected transitionOut: Transition;
    protected objectsToUpdate: UpdateObject[];
    protected registerUpdatingObject(object: UpdateObject): void;
    protected updateRegisteredObjects(delta: number): void;
    beginTransitionIn(onTransitionFinished: (scene: Scene) => void): void;
    beginTransitionOut(onTransitionFinished: (scene: Scene) => void): void;
    update(delta: number): void;
    protected createInitialResourceList(): (LoaderAddParam | string)[];
    beginLoadResource(onLoaded: () => void): Promise<void>;
    protected loadInitialResource(onLoaded: () => void): void;
    protected onResourceLoaded(): void;
    private filterLoadedAssets;
}
