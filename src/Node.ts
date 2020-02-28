import Event from "./Event";

export default interface Node {
  id: string;
  type: string;
  position: number[];
  params: { [key: string]: number | string };
  events: Event[];
}
