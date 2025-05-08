import { Action, ActionEvent, InputType } from './Action';
import { KeyboardEvent, MouseEvent } from 'react';
import _filter from 'lodash/filter';
import _keys from 'lodash/keys';
import { CanvasEngine } from '../CanvasEngine';
import { BaseModel } from '../core-models/BaseModel';

export class ActionEventBus {
	protected actions: { [id: string]: Action };
	protected engine: CanvasEngine;
	protected keys: { [key: string]: boolean };

	constructor(engine: CanvasEngine) {
		this.actions = {};
		this.engine = engine;
		this.keys = {};
	}

	getKeys(): string[] {
		return _keys(this.keys);
	}

	registerAction(action: Action): () => void {
		action.setEngine(this.engine);
		this.actions[action.id] = action;
		return () => {
			this.deregisterAction(action);
		};
	}

	deregisterAction(action: Action) {
		action.setEngine(null);
		delete this.actions[action.id];
	}

	getActionsForType(type: InputType): Action[] {
		return _filter(this.actions, (action) => {
			return action.options.type === type;
		});
	}

	getModelForEvent(actionEvent: ActionEvent<MouseEvent>): BaseModel {
		if (actionEvent.model) {
			return actionEvent.model;
		}
		return this.engine.getMouseElement(actionEvent.event);
	}

	getActionsForEvent(actionEvent: ActionEvent): Action[] {
		const { event } = actionEvent;
		if (event.type === 'mousedown') {
			return this.getActionsForType(InputType.MOUSE_DOWN);
		} else if (event.type === 'mouseup') {
			return this.getActionsForType(InputType.MOUSE_UP);
		} else if (event.type === 'keydown') {
			// store the recorded key
			this.keys[(event as KeyboardEvent).key.toLowerCase()] = true;
			return this.getActionsForType(InputType.KEY_DOWN);
		} else if (event.type === 'keyup') {
			// delete the recorded key
			const kbEvent = event as KeyboardEvent;
			const rawKey = kbEvent.key;
	  	if (typeof rawKey === 'string' && rawKey.length > 0) {
	    	const key = rawKey.toLowerCase();
	    	delete this.keys[key];
  		}
			return this.getActionsForType(InputType.KEY_UP);
		} else if (event.type === 'mousemove') {
			return this.getActionsForType(InputType.MOUSE_MOVE);
		} else if (event.type === 'wheel') {
			return this.getActionsForType(InputType.MOUSE_WHEEL);
		} else if (event.type === 'touchstart') {
			return this.getActionsForType(InputType.TOUCH_START);
		} else if (event.type === 'touchend') {
			return this.getActionsForType(InputType.TOUCH_END);
		} else if (event.type === 'touchmove') {
			return this.getActionsForType(InputType.TOUCH_MOVE);
		}

		return [];
	}

	fireAction(actionEvent: ActionEvent) {
		const actions = this.getActionsForEvent(actionEvent);
		for (let action of actions) {
			action.options.fire(actionEvent as any);
		}
	}
}
