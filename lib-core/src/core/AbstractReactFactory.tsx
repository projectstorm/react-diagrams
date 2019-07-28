import { BaseModel } from '../core-models/BaseModel';
import { AbstractModelFactory } from './AbstractModelFactory';

export interface GenerateWidgetEvent<T extends BaseModel> {
	model: T;
}

/**
 * Further extends the AbstractFactory to add widget generation capability.
 */
export abstract class AbstractReactFactory<T extends BaseModel> extends AbstractModelFactory<T> {
	/**
	 * Generates React widgets from the model contained in the event object
	 */
	abstract generateReactWidget(event: GenerateWidgetEvent<T>): JSX.Element;
}
