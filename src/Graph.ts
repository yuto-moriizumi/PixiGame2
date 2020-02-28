import Metadata from "./Metadata";
import Node from "./Node";

/**
 * UiGparh ルートオブジェクト定義
 */
export default interface Graph {
  nodes: Node[];
  metadata: Metadata;
}
