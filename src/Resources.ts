import Scene from "./Scene";

const Resource = Object.freeze({
  Static: {
    BattleBgFores: ["chang.png"],
    BattleBgMiddles: ["sun.png"],
    BattleBgBacks: ["wang.png"],
    Audio: {
      Bgm: {
        Title: "derheiml.mp3"
      },
      SE: {}
    }
  },
  FontFamily: {
    Default: "MisakiGothic"
  },
  SceneUIGraph: (scene: Scene): string => {
    const snake_case = scene.constructor.name
      .replace(/([A-Z])/g, s => {
        return `_${s.charAt(0).toLowerCase()}`;
      })
      .replace(/^_/, "");
    return `ui_graph/${snake_case}.json`;
  }
});

export default Resource;
