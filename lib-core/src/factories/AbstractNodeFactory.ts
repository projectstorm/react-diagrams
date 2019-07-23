import { NodeModel } from "../models/NodeModel";
import { DiagramEngine } from "../DiagramEngine";
import { AbstractFactory } from "./AbstractFactory";

export abstract class AbstractNodeFactory<T extends NodeModel = NodeModel> extends AbstractFactory<T> {
	abstract generateReactWidget(diagramEngine: DiagramEngine, node: T): JSX.Element;
}
