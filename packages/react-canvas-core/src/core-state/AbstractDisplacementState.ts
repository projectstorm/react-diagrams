import { State, StateOptions } from './State';
import { Action, ActionEvent, InputType } from '../core-actions/Action';
import { CanvasEngine } from '../CanvasEngine';

export interface AbstractDisplacementStateEvent {
	displacementX: number;
	displacementY: number;
	virtualDisplacementX: number;
	virtualDisplacementY: number;
	event: React.MouseEvent | React.TouchEvent;
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
					const { clientX, clientY } = actionEvent.event;
					this.handleMoveStart(clientX, clientY);
				}
			})
		);
		this.registerAction(
			new Action({
				type: InputType.MOUSE_MOVE,
				fire: (actionEvent: ActionEvent<React.MouseEvent>) => {
					const { event } = actionEvent;

					if (event.buttons === 0) {
						// If buttons is 0, it means the mouse is not down, the user may have released it
						// outside of the canvas, then we eject the state
						this.eject();

						return;
					}

					const { clientX, clientY } = event;
					this.handleMove(clientX, clientY, event);
				}
			})
		);
		this.registerAction(
			new Action({
				type: InputType.MOUSE_UP,
				fire: () => this.handleMoveEnd()
			})
		);

		this.registerAction(
			new Action({
				type: InputType.TOUCH_START,
				fire: (actionEvent: ActionEvent<React.TouchEvent>) => {
					const { clientX, clientY } = actionEvent.event.touches[0];
					this.handleMoveStart(clientX, clientY);
				}
			})
		);
		this.registerAction(
			new Action({
				type: InputType.TOUCH_MOVE,
				fire: (actionEvent: ActionEvent<React.TouchEvent>) => {
					const { event } = actionEvent;
					const { clientX, clientY } = event.touches[0];
					this.handleMove(clientX, clientY, event);
				}
			})
		);
		this.registerAction(
			new Action({
				type: InputType.TOUCH_END,
				fire: () => this.handleMoveEnd()
			})
		);
	}

	protected handleMoveStart(x: number, y: number): void {
		this.initialX = x;
		this.initialY = y;
		const rel = this.engine.getRelativePoint(x, y);
		this.initialXRelative = rel.x;
		this.initialYRelative = rel.y;
	}

	protected handleMove(x: number, y: number, event: React.MouseEvent | React.TouchEvent): void {
		this.fireMouseMoved({
			displacementX: x - this.initialX,
			displacementY: y - this.initialY,
			virtualDisplacementX: (x - this.initialX) / (this.engine.getModel().getZoomLevel() / 100.0),
			virtualDisplacementY: (y - this.initialY) / (this.engine.getModel().getZoomLevel() / 100.0),
			event
		});
	}

	protected handleMoveEnd(): void {
		this.eject();
	}

	abstract fireMouseMoved(event: AbstractDisplacementStateEvent);
}
