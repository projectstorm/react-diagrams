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
			// In rare cases (exact conditions unknown) the passed event is an Event
			// rather than KeyboardEvent, so doesn't contain a key property. I prefer
			// to test directly for whether key is present rather than the class:
			// given we're already in weird territory let's not try and make
			// assumptions from other information.
			const key = (event as KeyboardEvent).key;
			if (!key) return [];

			// store the recorded key
			this.keys[key.toLowerCase()] = true;
			return this.getActionsForType(InputType.KEY_DOWN);
		} else if (event.type === 'keyup') {
			const key = (event as KeyboardEvent).key;
			if (!key) return [];

			// delete the recorded key
			delete this.keys[key.toLowerCase()];
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
