import { LabelModel } from "../models/LabelModel";
import { DiagramEngine } from "../DiagramEngine";
import { AbstractFactory } from "./AbstractFactory";

export abstract class AbstractLabelFactory<T extends LabelModel = LabelModel> extends AbstractFactory<T> {
	abstract generateReactWidget(diagramEngine: DiagramEngine, link: T): JSX.Element;
}
