import { AbstractNodeFactory } from "../../factories/AbstractNodeFactory";
import { DefaultGroupNodeModel } from "../models/DefaultGroupNodeModel";
import { DiagramEngine } from "../../DiagramEngine";
import * as React from "react";
import { DefaultGroupNodeWidget } from "../widgets/DefaultGroupNodeWidget";

export class DefaultGroupNodeFactory extends AbstractNodeFactory<DefaultGroupNodeModel> {
	constructor() {
		super("default-group-node");
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: DefaultGroupNodeModel): any {
		return <DefaultGroupNodeWidget node={node} />;
	}

	getNewInstance(initialConfig?: any): DefaultGroupNodeModel {
		return new DefaultGroupNodeModel("Default Group");
	}
}
