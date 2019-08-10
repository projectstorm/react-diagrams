import { State, StateOptions } from './State';
import { Action, ActionEvent, InputType } from '../core-actions/Action';
import { CanvasEngine } from '../CanvasEngine';

export interface AbstractDisplacementStateEvent {
	displacementX: number;
	displacementY: number;
	virtualDisplacementX: number;
	virtualDisplacementY: number;
	event: React.MouseEvent;
}

export abstract class AbstractDisplacementState<E extends CanvasEngine = CanvasEngine> extends State<E> {
	initialX: number;
	initialY: number;
	initialXRelative: number;
	initialYRelative: number;

	constructor(options: StateOptions) {
		super(options);
		this.registerAction(
			new Action({
				type: InputType.MOUSE_DOWN,
				fire: (actionEvent: ActionEvent<React.MouseEvent>) => {
					this.initialX = actionEvent.event.clientX;
					this.initialY = actionEvent.event.clientY;
					const rel = this.engine.getRelativePoint(actionEvent.event.clientX, actionEvent.event.clientY);
					this.initialXRelative = rel.x;
					this.initialYRelative = rel.y;
				}
			})
		);
		this.registerAction(
			new Action({
				type: InputType.MOUSE_MOVE,
				fire: (actionEvent: ActionEvent<React.MouseEvent>) => {
					const { event } = actionEvent;
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
				fire: (event: ActionEvent<React.MouseEvent>) => {
					// when the mouse if up, we eject this state
					this.eject();
				}
			})
		);
	}

	abstract fireMouseMoved(event: AbstractDisplacementStateEvent);
}
