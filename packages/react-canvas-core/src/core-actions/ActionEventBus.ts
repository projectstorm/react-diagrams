import { Action, ActionEvent, InputType } from './Action';
import { KeyboardEvent, MouseEvent } from 'react';
import * as _ from 'lodash';
import { CanvasEngine } from '../CanvasEngine';
import { BaseModel } from '../core-models/BaseModel';

export class ActionEventBus {
	protected actions: { [id: string]: Action };
	protected engine: CanvasEngine;
	protected keys: { [key: string]: boolean };
	protected mouseButtonPressed: number;

	constructor(engine: CanvasEngine) {
		this.actions = {};
		this.engine = engine;
		this.keys = {};
		this.mouseButtonPressed = null;
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
		return _.filter(this.actions, (action) => {
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
		const eventActions = {
			// Mouse events
			mousedown: () => {
				if (this.mouseButtonPressed === null || this.mouseButtonPressed === (event as MouseEvent).button) {
					// store the pressed mouse button
					this.mouseButtonPressed = (event as MouseEvent).button;
					return this.getActionsForType(InputType.MOUSE_DOWN);
				}
			},
			mouseup: () => {
				if (this.mouseButtonPressed === (event as MouseEvent).button) {
					// delete the pressed mouse button
					this.mouseButtonPressed = null;
					return this.getActionsForType(InputType.MOUSE_UP);
				}
			},
			mousemove: () => {
				return this.getActionsForType(InputType.MOUSE_MOVE);
			},
			wheel: () => {
				return this.getActionsForType(InputType.MOUSE_WHEEL);
			},
			// Keyboard events
			keydown: () => {
				// store the recorded key
				this.keys[(event as KeyboardEvent).key.toLowerCase()] = true;
				return this.getActionsForType(InputType.KEY_DOWN);
			},
			keyup: () => {
				// delete the recorded key
				delete this.keys[(event as KeyboardEvent).key.toLowerCase()];
				return this.getActionsForType(InputType.KEY_UP);
			},
			// Touch events
			touchstart: () => {
				return this.getActionsForType(InputType.TOUCH_START);
			},
			touchend: () => {
				return this.getActionsForType(InputType.TOUCH_END);
			},
			touchmove: () => {
				return this.getActionsForType(InputType.TOUCH_MOVE);
			}
		};

		return eventActions[event.type]?.() || [];
	}

	fireAction(actionEvent: ActionEvent) {
		const actions = this.getActionsForEvent(actionEvent);
		for (let action of actions) {
			action.options.fire(actionEvent as any);
		}
	}
}
