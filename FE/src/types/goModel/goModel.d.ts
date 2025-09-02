export interface GoModel {
  nodeKeyProperty: string;
  nodeDataArray: NodeItem[] | [];
  linkDataArray: StepItem[] | [];
}

export interface NodeItem {
  id: string;
  loc: string;
  text: string;
}

export interface StepItem {
  from: string;
  to: string;
  text: string;
}
