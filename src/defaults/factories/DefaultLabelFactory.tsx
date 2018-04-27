import * as React from "react";
import { DiagramEngine } from "../../DiagramEngine";
import { DefaultLabelModel } from "../models/DefaultLabelModel";
import { DefaultLabelWidget } from "../widgets/DefaultLabelWidget";
import {AbstractElementFactory} from "@projectstorm/react-canvas";

export class DefaultLabelFactory extends AbstractElementFactory<DefaultLabelModel> {

	constructor() {
		super("default");
	}

	generateWidget(engine: DiagramEngine, model: DefaultLabelModel): JSX.Element {
		return <DefaultLabelWidget model={model} />;
	}

	generateModel(): DefaultLabelModel {
		return new DefaultLabelModel();
    }
}
