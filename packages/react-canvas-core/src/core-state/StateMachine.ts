import {AbstractState} from "./AbstractState";

export class StateMachine {

	protected currentState: AbstractState;

	setState(state: AbstractState){
		// deactivate old state
		if(this.currentState){
			this.currentState.deactivated();
		}

		this.currentState = state;

		// activate new state
		if(this.currentState){
			this.currentState.activated();
		}
	}

}
