import { State } from '../core-state/State';
import { Action, ActionEvent, InputType } from '../core-actions/Action';
import { MouseEvent } from 'react';
import { DragCanvasState } from './DragCanvasState';
import { SelectingState } from './SelectingState';
import { MoveItemsState } from './MoveItemsState';

export class DefaultState extends State {
	constructor() {
		super({
			name: 'default'
		});
		this.childStates = [new SelectingState()];

		// determine what was clicked on
		this.registerAction(
			new Action({
				type: InputType.MOUSE_DOWN,
				fire: (event: ActionEvent<MouseEvent>) => {
					const element = this.engine.getActionEventBus().getModelForEvent(event);

					// the canvas was clicked on, transition to the dragging canvas state
					if (!element) {
						this.transitionWithEvent(new DragCanvasState(), event);
					} else {
						this.transitionWithEvent(new MoveItemsState(), event);
					}
				}
			})
		);
	}
}
