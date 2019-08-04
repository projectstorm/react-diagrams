import { BaseModel } from '../core-models/BaseModel';
import { AbstractModelFactory } from './AbstractModelFactory';
import { CanvasEngine } from '../CanvasEngine';

export interface GenerateWidgetEvent<T extends BaseModel> {
	model: T;
}

/**
 * Further extends the AbstractFactory to add widget generation capability.
 */
export abstract class AbstractReactFactory<
	T extends BaseModel = BaseModel,
	E extends CanvasEngine = CanvasEngine
> extends AbstractModelFactory<T, E> {
	/**
	 * Generates React widgets from the model contained in the event object
	 */
	abstract generateReactWidget(event: GenerateWidgetEvent<T>): JSX.Element;
}
