import { CanvasEngine } from '../CanvasEngine';
import { Action, ActionEvent, InputType } from '../core-actions/Action';
import { SyntheticEvent } from 'react';
import * as _ from 'lodash';

export interface StateOptions {
	name: string;
}

export abstract class State<E extends CanvasEngine = CanvasEngine> {
	protected engine: E;
	protected actions: Action[];
	protected keys: string[];
	protected options: StateOptions;
	protected childStates: State[];

	private handler1;
	private handler2;

	constructor(options: StateOptions) {
		this.actions = [];
		this.keys = [];
		this.childStates = [];
		this.options = options;
	}

	setEngine(engine: E) {
		this.engine = engine;
	}

	getOptions() {
		return this.options;
	}

	eject() {
		this.engine.getStateMachine().popState();
	}

	transitionWithEvent(state: State, event: ActionEvent<SyntheticEvent>) {
		this.engine.getStateMachine().pushState(state);
		this.engine.getActionEventBus().fireAction(event);
	}

	registerAction(action: Action) {
		this.actions.push(action);
	}

	tryActivateParentState(keys: string[]) {
		if (this.keys.length > 0 && !this.isKeysFullfilled(keys)) {
			this.eject();
			return true;
		}
		return false;
	}

	tryActivateChildState(keys: string[]) {
		const state = this.findStateToActivate(keys);
		if (state) {
			this.engine.getStateMachine().pushState(state);
			return true;
		}
		return false;
	}

	findStateToActivate(keys: string[]) {
		for (let child of this.childStates) {
			if (child.isKeysFullfilled(keys)) {
				return child;
			}
		}

		return null;
	}

	isKeysFullfilled(keys: string[]) {
		return _.intersection(this.keys, keys).length === this.keys.length;
	}

	activated(previous: State) {
		const keys = this.engine.getActionEventBus().getKeys();

		if (this.tryActivateParentState(keys) || this.tryActivateChildState(keys)) {
			return;
		}

		// perhaps we need to pop again?
		this.handler1 = this.engine.getActionEventBus().registerAction(
			new Action({
				type: InputType.KEY_DOWN,
				fire: () => {
					this.tryActivateChildState(this.engine.getActionEventBus().getKeys());
				}
			})
		);

		this.handler2 = this.engine.getActionEventBus().registerAction(
			new Action({
				type: InputType.KEY_UP,
				fire: () => {
					this.tryActivateParentState(this.engine.getActionEventBus().getKeys());
				}
			})
		);

		for (let action of this.actions) {
			this.engine.getActionEventBus().registerAction(action);
		}
	}

	deactivated(next: State) {
		if (this.handler1) {
			this.handler1();
		}
		if (this.handler2) {
			this.handler2();
		}
		// if this happens, we are going into heirachial state machine mode
		for (let action of this.actions) {
			this.engine.getActionEventBus().deregisterAction(action);
		}
	}
}
