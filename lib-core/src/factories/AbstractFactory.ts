import { BaseModel } from '../models/BaseModel';
import { DiagramEngine } from '../DiagramEngine';

export abstract class AbstractFactory<T extends BaseModel> {
	type: string;
	protected engine: DiagramEngine;

	constructor(name: string) {
		this.type = name;
	}

	setDiagramEngine(engine: DiagramEngine) {
		this.engine = engine;
	}

	getType(): string {
		return this.type;
	}

	abstract getNewInstance(initialConfig?: any): T;
}
