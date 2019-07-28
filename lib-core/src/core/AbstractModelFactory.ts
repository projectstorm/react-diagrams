import { AbstractFactory } from './AbstractFactory';
import { BaseModel } from '../core-models/BaseModel';

export interface GenerateModelEvent {
	initialConfig?: any;
}

export abstract class AbstractModelFactory<T extends BaseModel> extends AbstractFactory<T> {
	/**
	 * Generates new models (the core factory pattern)
	 */
	abstract generateModel(event: GenerateModelEvent): T;
}
