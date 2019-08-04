import { State, StateOptions } from './State';
import { Action, InputType } from '../core-actions/Action';

export interface AbstractDisplacementStateEvent {
	displacementX: number;
	displacementY: number;
	virtualDisplacementX: number;
	virtualDisplacementY: number;
	event: React.MouseEvent;
}

export abstract class AbstractDisplacementState extends State {
	initialX: number;
	initialY: number;

	constructor(options: StateOptions) {
		super(options);
		this.registerAction(
			new Action({
				type: InputType.MOUSE_DOWN,
				fire: (event: React.MouseEvent) => {
					this.initialX = event.clientX;
					this.initialY = event.clientY;
				}
			})
		);
		this.registerAction(
			new Action({
				type: InputType.MOUSE_MOVE,
				fire: (event: React.MouseEvent) => {
					this.fireMouseMoved({
						displacementX: event.clientX - this.initialX,
						displacementY: event.clientY - this.initialY,
						virtualDisplacementX: (event.clientX - this.initialX) / (this.engine.getModel().getZoomLevel() / 100.0),
						virtualDisplacementY: (event.clientY - this.initialY) / (this.engine.getModel().getZoomLevel() / 100.0),
						event: event
					});
				}
			})
		);
		this.registerAction(
			new Action({
				type: InputType.MOUSE_UP,
				fire: (event: React.MouseEvent) => {
					// when the mouse if up, we eject this state
					this.eject();
				}
			})
		);
	}

	abstract fireMouseMoved(event: AbstractDisplacementStateEvent);
}
