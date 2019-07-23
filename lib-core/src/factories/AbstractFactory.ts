import { BaseModel } from "../models/BaseModel";

export abstract class AbstractFactory<T extends BaseModel> {
	type: string;

	constructor(name: string) {
		this.type = name;
	}

	getType(): string {
		return this.type;
	}

	abstract getNewInstance(initialConfig?: any): T;
}
