import { Action, ActionEvent, InputType } from './Action';
import { KeyboardEvent, MouseEvent } from 'react';
import * as _ from 'lodash';
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
		return _.keys(this.keys);
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
		return _.filter(this.actions, action => {
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
			delete this.keys[(event as KeyboardEvent).key.toLowerCase()];
			return this.getActionsForType(InputType.KEY_UP);
		} else if (event.type === 'mousemove') {
			return this.getActionsForType(InputType.MOUSE_MOVE);
		} else if (event.type === 'wheel') {
			return this.getActionsForType(InputType.MOUSE_WHEEL);
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
