import { BaseModel } from "./models/BaseModel";
import { NodeModel } from "./models/NodeModel";
import { LinkModel } from "./models/LinkModel";
import { DiagramEngine } from "./DiagramEngine";
import { PortModel } from "./models/PortModel";
import {PointModel} from "./models/PointModel";

export abstract class AbstractFactory<T extends BaseModel> {
	type: string;

	constructor(name: string) {
		this.type = name;
	}

	getType(): string {
		return this.type;
	}

	abstract getNewInstance(initialConfig?: any): T;
}

export abstract class NodeFactory<T extends NodeModel = NodeModel> extends AbstractFactory<T> {
	abstract generateReactWidget(diagramEngine: DiagramEngine, node: T): JSX.Element;
}

export abstract class LinkFactory<T extends LinkModel = LinkModel> extends AbstractFactory<T> {

	abstract generateReactWidget(diagramEngine: DiagramEngine, link: T): JSX.Element;

}

export abstract class PortFactory<T extends PortModel = PortModel> extends AbstractFactory<T> {}

export class SimplePortFactory extends PortFactory {
	cb: (initialConfig?: any) => PortModel;

	constructor(type: string, cb: (initialConfig?: any) => PortModel) {
		super(type);
		this.cb = cb;
	}

	getNewInstance(initialConfig?: any): PortModel {
		return this.cb(initialConfig);
	}
}
