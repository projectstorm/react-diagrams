import { Action, ActionEvent, InputType } from '../core-actions/Action';
import { KeyboardEvent } from 'react';
import * as _ from 'lodash';

export interface DeleteItemsActionOptions {
	keyCodes?: number[];
	modifiers?: {
		ctrlKey?: boolean;
		shiftKey?: boolean;
		altKey?: boolean;
		metaKey?: boolean;
	};
}

/**
 * Deletes all selected items
 */
export class DeleteItemsAction extends Action {
	constructor(options: DeleteItemsActionOptions = {}) {
		const keyCodes = options.keyCodes || [46, 8];
		const modifiers = {
			ctrlKey: false,
			shiftKey: false,
			altKey: false,
			metaKey: false,
			...options.modifiers
		};

		super({
			type: InputType.KEY_DOWN,
			fire: (event: ActionEvent<KeyboardEvent>) => {
				const { keyCode, ctrlKey, shiftKey, altKey, metaKey } = event.event;

				if (keyCodes.indexOf(keyCode) !== -1 && _.isEqual({ ctrlKey, shiftKey, altKey, metaKey }, modifiers)) {
					_.forEach(this.engine.getModel().getSelectedEntities(), (model) => {
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
