import { Action, ActionEvent, InputType } from '../core-actions/Action';
import { KeyboardEvent } from 'react';
import * as _ from 'lodash';

export interface DeleteItemsActionOptions {
	keyCodes?: number[];
}

/**
 * Deletes all selected items
 */
export class DeleteItemsAction extends Action {
	constructor(options: DeleteItemsActionOptions = {}) {
		options = {
			keyCodes: [46, 8],
			...options
		};
		super({
			type: InputType.KEY_DOWN,
			fire: (event: ActionEvent<KeyboardEvent>) => {
				if (options.keyCodes.indexOf(event.event.keyCode) !== -1) {
					_.forEach(this.engine.getModel().getSelectedEntities(), model => {
						// only delete items which are not locked
						if (!model.isLocked()) {
							model.remove();
						}
					});
					this.engine.repaintCanvas();
				}
			}
		});
	}
}
