import { DefaultNodeModel } from "../models/DefaultNodeModel";
import * as React from "react";
import { DefaultNodeWidget } from "../widgets/DefaultNodeWidget";
import { DiagramEngine } from "../../DiagramEngine";
import { AbstractElementFactory } from "@projectstorm/react-canvas";

export class DefaultNodeFactory extends AbstractElementFactory<DefaultNodeModel> {
	constructor() {
		super("default");
	}

	generateWidget(diagramEngine: DiagramEngine, model: DefaultNodeModel): JSX.Element {
		return React.createElement(DefaultNodeWidget, {
			node: model,
			diagramEngine: diagramEngine
		});
	}

	generateModel(): DefaultNodeModel {
		return new DefaultNodeModel();
	}
}
