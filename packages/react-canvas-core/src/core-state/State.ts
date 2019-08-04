import { CanvasEngine } from '../CanvasEngine';
import { Action, InputType } from '../core-actions/Action';
import { SyntheticEvent } from 'react';
import * as _ from 'lodash';

export interface StateOptions {
	parent?: string;
	name: string;
}

export abstract class State {
	protected engine: CanvasEngine;
	protected actions: Action[];
	protected keys: string[];
	protected options: StateOptions;
	protected childStates: State[];
	private handler;

	constructor(options: StateOptions) {
		this.actions = [];
		this.keys = [];
		this.childStates = [];
		this.options = options;
	}

	setEngine(engine: CanvasEngine) {
		this.engine = engine;
	}

	getOptions() {
		return this.options;
	}

	eject() {
		this.engine.getStateMachine().popState();
	}

	transitionWithEvent(state: State, event: SyntheticEvent) {
		this.engine.getStateMachine().pushState(state);
		this.engine.getActionEventBus().fireAction(event);
	}

	registerAction(action: Action) {
		this.actions.push(action);
	}

	tryActivateChildState() {
		const state = this.findStateToActivate();
		if (state) {
			this.engine.getStateMachine().pushState(state);
			return true;
		}
		return false;
	}

	findStateToActivate() {
		const keys = this.engine.getActionEventBus().getKeys();
		for (let child of this.childStates) {
			// activate this state!
			if (_.intersection(child.keys, keys).length === child.keys.length) {
				return child;
			}
		}

		return null;
	}

	activated(previous: State) {
		if (this.keys.length > 0) {
			// try and activate a child state, if we cant, listen for keyboard events to try again
			if (!this.tryActivateChildState()) {
				this.handler = this.engine.getActionEventBus().registerAction(
					new Action({
						type: InputType.KEY_DOWN,
						fire: () => {
							this.tryActivateChildState();
						}
					})
				);
			}
		}
		for (let action of this.actions) {
			this.engine.getActionEventBus().registerAction(action);
		}
	}

	deactivated(next: State) {
		if (this.handler) {
			this.handler();
		}
		// if this happens, we are going into heirachial state machine mode
		for (let action of this.actions) {
			this.engine.getActionEventBus().deregisterAction(action);
		}
	}
}
