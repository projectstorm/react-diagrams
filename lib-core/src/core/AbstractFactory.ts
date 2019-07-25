import { BaseModel } from '../core-models/BaseModel';
import { DiagramEngine } from '../DiagramEngine';

export interface GenerateModelEvent {
	initialConfig?: any;
}

/**
 * Base factory for all the different types of entities.
 * Gets registered with the engine, and is used to generate models
 */
export abstract class AbstractFactory<T extends BaseModel = BaseModel> {
	/**
	 * Couples the factory with the models it generates
	 */
	protected type: string;
	/**
	 * The engine gets injected when the factory is registered
	 */
	protected engine: DiagramEngine;

	constructor(type: string) {
		this.type = type;
	}

	setDiagramEngine(engine: DiagramEngine) {
		this.engine = engine;
	}

	getType(): string {
		return this.type;
	}

	/**
	 * Generates new models (the core factory pattern)
	 */
	abstract generateModel(event: GenerateModelEvent): T;
}
