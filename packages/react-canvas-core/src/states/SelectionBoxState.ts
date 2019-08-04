import { AbstractDisplacementState, AbstractDisplacementStateEvent } from '../core-state/AbstractDisplacementState';

export class SelectionBoxState extends AbstractDisplacementState {
	constructor() {
		super({
			name: 'selection-box'
		});
	}

	fireMouseMoved(event: AbstractDisplacementStateEvent) {}
}
