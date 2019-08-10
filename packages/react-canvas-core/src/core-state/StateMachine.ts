import { State } from './State';
import * as _ from 'lodash';
import { CanvasEngine } from '../CanvasEngine';

export class StateMachine {
	protected currentState: State;
	protected stateStack: State[];
	protected engine: CanvasEngine;

	constructor(engine: CanvasEngine) {
		this.engine = engine;
		this.stateStack = [];
	}

	getCurrentState() {
		return this.currentState;
	}

	pushState(state: State) {
		this.stateStack.push(state);
		this.setState(state);
	}

	popState() {
		const oldState = this.stateStack.pop();
		const state = this.setState(_.last(this.stateStack));
	}

	setState(state: State) {
		state.setEngine(this.engine);

		// if no state object, get the initial state
		if (this.currentState) {
			this.currentState.deactivated(state);
		}
		const old = this.currentState;
		this.currentState = state;
		if (this.currentState) {
			this.currentState.activated(old);
		}
	}
}
