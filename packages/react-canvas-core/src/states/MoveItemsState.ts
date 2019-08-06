import { AbstractDisplacementState, AbstractDisplacementStateEvent } from '../core-state/AbstractDisplacementState';
import { State } from '../core-state/State';
import { Action, InputType } from '../core-actions/Action';
import { BasePositionModel } from '../core-models/BasePositionModel';
import { Point } from '@projectstorm/geometry';

export class MoveItemsState extends AbstractDisplacementState {
	initialPositions: { [id: string]: Point };

	constructor() {
		super({
			name: 'move-items'
		});
		this.registerAction(
			new Action({
				type: InputType.MOUSE_DOWN,
				fire: (event: React.MouseEvent) => {
					const element = this.engine.getMouseElement(event);
					if (!element.model.isSelected()) {
						this.engine.getModel().clearSelection();
					}
					element.model.setSelected(true);
					this.engine.repaintCanvas();
				}
			})
		);
	}

	activated(previous: State) {
		super.activated(previous);
		this.initialPositions = {};
	}

	fireMouseMoved(event: AbstractDisplacementStateEvent) {
		const items = this.engine.getModel().getSelectedItems();
		for (let item of items) {
			if (item instanceof BasePositionModel) {
				if (item.isLocked()) {
					continue;
				}
				if (!this.initialPositions[item.getID()]) {
					this.initialPositions[item.getID()] = item.getPosition();
				}

				const pos = this.initialPositions[item.getID()];
				item.setPosition(pos.x + event.virtualDisplacementX, pos.y + event.virtualDisplacementY);
			}
		}
		this.engine.repaintCanvas();
	}
}
