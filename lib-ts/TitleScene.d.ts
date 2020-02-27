import Scene from "./Scene";
import LoaderAddParam from "./LoaderAddParam";
export default class TitleScene extends Scene {
    private text;
    constructor();
    protected createInitialResourceList(): (LoaderAddParam | string)[];
    protected onResourceLoaded(): void;
    showOrderScene(): void;
}
