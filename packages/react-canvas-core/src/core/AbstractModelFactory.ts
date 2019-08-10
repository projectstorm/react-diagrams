import { AbstractFactory } from './AbstractFactory';
import { BaseModel } from '../core-models/BaseModel';
import { CanvasEngine } from '../CanvasEngine';

export interface GenerateModelEvent {
	initialConfig?: any;
}

export abstract class AbstractModelFactory<
	T extends BaseModel = BaseModel,
	E extends CanvasEngine = CanvasEngine
> extends AbstractFactory<E> {
	/**
	 * Generates new models (the core factory pattern)
	 */
	abstract generateModel(event: GenerateModelEvent): T;
}
