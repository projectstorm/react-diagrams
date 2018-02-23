import * as React from "react";
import {DiagramEngine} from "../../DiagramEngine";
import {LabelFactory} from "../../AbstractFactory";
import {DefaultLabelModel} from "../models/DefaultLabelModel";

/**
 * @author Dylan Vorster
 */
export class DefaultLabelFactory extends LabelFactory<DefaultLabelModel> {
	constructor() {
		super("default");
	}

	generateReactWidget(diagramEngine: DiagramEngine, label: DefaultLabelModel): JSX.Element {
		return <div>{label.label}</div>;
	}

	getNewInstance(initialConfig?: any): DefaultLabelModel {
		return new DefaultLabelModel();
	}
}
