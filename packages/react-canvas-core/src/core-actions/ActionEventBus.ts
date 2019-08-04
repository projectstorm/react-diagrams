import { Action, InputType } from './Action';
import { SyntheticEvent } from 'react';
import * as _ from 'lodash';
import { CanvasEngine } from '../CanvasEngine';

export class ActionEventBus {
	protected actions: { [id: string]: Action };
	protected engine: CanvasEngine;

	constructor(engine: CanvasEngine) {
		this.actions = {};
		this.engine = engine;
	}

	registerAction(action: Action) {
		action.setEngine(this.engine);
		this.actions[action.id] = action;
	}

	deregisterAction(action: Action) {
		action.setEngine(null);
		delete this.actions[action.id];
	}

	getActionsForType(type: InputType): Action[] {
		return _.filter(this.actions, action => {
			return action.options.type === type;
		});
	}

	getActionsForEvent(event: SyntheticEvent): Action[] {
		if (event.type === 'mousedown') {
			return this.getActionsForType(InputType.MOUSE_DOWN);
		} else if (event.type === 'mouseup') {
			return this.getActionsForType(InputType.MOUSE_UP);
		} else if (event.type === 'keydown') {
			return this.getActionsForType(InputType.KEY_DOWN);
		} else if (event.type === 'keyup') {
			return this.getActionsForType(InputType.KEY_UP);
		} else if (event.type === 'mousemove') {
			return this.getActionsForType(InputType.MOUSE_MOVE);
		} else if (event.type === 'wheel') {
			return this.getActionsForType(InputType.MOUSE_WHEEL);
		}
		return [];
	}

	fireAction(event: SyntheticEvent) {
		const actions = this.getActionsForEvent(event);
		for (let action of actions) {
			action.options.fire(event as any);
		}
	}
}
