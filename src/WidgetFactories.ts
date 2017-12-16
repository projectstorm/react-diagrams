import { DiagramEngine } from "./DiagramEngine";
import { NodeModel } from "./models/NodeModel";
import { LinkModel } from "./models/LinkModel";
/**
 * @author Dylan Vorster
 */
export abstract class WidgetFactory {
	type: string;

	constructor(name: string) {
		this.type = name;
	}

	getType(): string {
		return this.type;
	}
}

export abstract class NodeWidgetFactory extends WidgetFactory {
	abstract generateReactWidget(diagramEngine: DiagramEngine, node: NodeModel): JSX.Element;
}

export abstract class LinkWidgetFactory extends WidgetFactory {
	abstract generateReactWidget(diagramEngine: DiagramEngine, link: LinkModel): JSX.Element;
}
