import { DefaultPortModel } from "../models/DefaultPortModel";
import { PortFactory } from "../../AbstractFactory";

export class DefaultPortFactory extends PortFactory<DefaultPortModel> {
	constructor() {
		super("default");
	}

	getNewInstance(initialConfig?: any): DefaultPortModel {
		return new DefaultPortModel(true, "unknown");
	}
}
