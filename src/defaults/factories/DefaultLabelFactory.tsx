import * as React from "react";
import {DiagramEngine} from "../../DiagramEngine";
import {LabelFactory} from "../../AbstractFactory";
import {DefaultLabelModel} from "../models/DefaultLabelModel";
import {DefaultLabelWidget} from "../widgets/DefaultLabelWidget";

/**
 * @author Dylan Vorster
 */
export class DefaultLabelFactory extends LabelFactory<DefaultLabelModel> {
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
