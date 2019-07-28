import { AbstractActionFactory, ActionFactoryActivationEvent } from '../../core-actions/AbstractActionFactory';
import { MouseEvent } from 'react';
import { MoveItemsAction } from './MoveItemsAction';

export interface MoveItemsActionFactoryOptions {
	allowLooseLinks?: boolean;
}

export class MoveItemsActionFactory extends AbstractActionFactory<MoveItemsAction> {
	options: MoveItemsActionFactoryOptions;

	static NAME = 'move-items';

	constructor(options: MoveItemsActionFactoryOptions = {}) {
		super(MoveItemsActionFactory.NAME);
		this.options = {
			...options,
			allowLooseLinks: options.allowLooseLinks == null ? true : options.allowLooseLinks
		};
	}

	generateAction(event: MouseEvent): MoveItemsAction {
		return new MoveItemsAction(event.clientX, event.clientY, this.engine, this.options.allowLooseLinks);
	}

	activate(event: ActionFactoryActivationEvent): boolean {
		if (event.selectedModel) {
			return !this.engine.isModelLocked(event.selectedModel);
		}
		return false;
	}
}
