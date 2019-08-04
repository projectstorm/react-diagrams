import { AbstractDisplacementState, AbstractDisplacementStateEvent } from '../core-state/AbstractDisplacementState';
import { SelectingState } from './SelectingState';

export class SelectionBoxState extends AbstractDisplacementState {
	static NAME = 'selection-box';

	constructor() {
		super({
			name: SelectionBoxState.NAME,
			parent: SelectingState.NAME
		});
	}

	fireMouseMoved(event: AbstractDisplacementStateEvent) {}
}
