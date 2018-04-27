import { DefaultPortModel } from "../models/DefaultPortModel";
import { AbstractElementFactory } from "@projectstorm/react-canvas";
import { DiagramEngine } from "storm-react-diagrams";

export class DefaultPortFactory extends AbstractElementFactory<DefaultPortModel> {
	constructor() {
		super("default");
	}

	generateWidget(engine: DiagramEngine, model: DefaultPortModel): JSX.Element {
		return null;
	}

	generateModel(): DefaultPortModel {
		return new DefaultPortModel(true, "unknown");
	}
}
