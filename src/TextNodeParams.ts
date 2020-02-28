import NodeParams from "./Node";

export default interface TextNodeParams extends NodeParams {
  family: string;
  text: string;
  size: number;
  color: string;
  padding: number;
}
