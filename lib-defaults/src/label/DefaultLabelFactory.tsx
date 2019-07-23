import * as React from "react";
import {AbstractLabelFactory, DiagramEngine} from "@projectstorm/react-diagrams-core";
import {DefaultLabelModel} from "./DefaultLabelModel";
import {DefaultLabelWidget} from "./DefaultLabelWidget";

/**
 * @author Dylan Vorster
 */
export class DefaultLabelFactory extends AbstractLabelFactory<DefaultLabelModel> {
	constructor() {
		super("default");
	}

	generateReactWidget(diagramEngine: DiagramEngine, label: DefaultLabelModel): JSX.Element {
		return <DefaultLabelWidget model={label} />;
	}

	getNewInstance(initialConfig?: any): DefaultLabelModel {
		return new DefaultLabelModel();
	}
}
