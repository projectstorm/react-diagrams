import { BaseModel } from "../models/BaseModel";

export abstract class AbstractFactory<T extends BaseModel> {
	type: string;

	constructor(type: string) {
		this.type = type;
	}

	getType(): string {
		return this.type;
	}

	abstract getNewInstance(initialConfig?: any): T;
}
