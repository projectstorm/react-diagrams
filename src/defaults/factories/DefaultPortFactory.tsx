import { DefaultPortModel } from "../models/DefaultPortModel";
import { AbstractPortFactory } from "../../factories/AbstractPortFactory";

export class DefaultPortFactory extends AbstractPortFactory<DefaultPortModel> {
	constructor() {
		super("default");
	}

	getNewInstance(initialConfig?: any): DefaultPortModel {
		return new DefaultPortModel(true, "unknown");
	}
}
