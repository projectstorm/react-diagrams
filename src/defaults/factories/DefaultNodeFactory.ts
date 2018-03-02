import { DefaultNodeModel } from "../models/DefaultNodeModel";
import * as React from "react";
import { DefaultNodeWidget } from "../widgets/DefaultNodeWidget";
import { DiagramEngine } from "../../DiagramEngine";
import { AbstractNodeFactory } from "../../factories/AbstractNodeFactory";
/**
 * @author Dylan Vorster
 */
export class DefaultNodeFactory extends AbstractNodeFactory<DefaultNodeModel> {
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
