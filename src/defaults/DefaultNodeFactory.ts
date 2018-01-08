import { DefaultNodeModel } from "./DefaultNodeModel";
import * as React from "react";
import { DefaultNodeWidget } from "./DefaultNodeWidget";
import { DiagramEngine } from "../DiagramEngine";
import { NodeFactory } from "../AbstractFactory";
/**
 * @author Dylan Vorster
 */
export class DefaultNodeFactory extends NodeFactory<DefaultNodeModel> {
	constructor() {
		super("default");
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: DefaultNodeModel): JSX.Element {
		return React.createElement(DefaultNodeWidget, {
			node: node,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance(initialConfig?: any): DefaultNodeModel {
		return new DefaultNodeModel();
	}
}
