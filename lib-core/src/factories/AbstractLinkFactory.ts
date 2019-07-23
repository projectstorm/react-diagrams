import { LinkModel } from "../models/LinkModel";
import { DiagramEngine } from "../DiagramEngine";
import { AbstractFactory } from "./AbstractFactory";

export abstract class AbstractLinkFactory<T extends LinkModel = LinkModel> extends AbstractFactory<T> {
	abstract generateReactWidget(diagramEngine: DiagramEngine, link: T): JSX.Element;
}
