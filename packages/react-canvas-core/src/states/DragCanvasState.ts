import { AbstractDisplacementState, AbstractDisplacementStateEvent } from '../core-state/AbstractDisplacementState';
import { State } from '../core-state/State';

export class DragCanvasState extends AbstractDisplacementState {
	// store this as we drag the canvas
	initialCanvasX: number;
	initialCanvasY: number;

	constructor() {
		super({
			name: 'drag-canvas'
		});
	}

	async activated(prev) {
		super.activated(prev);
		this.engine.getModel().clearSelection();
		await this.engine.repaintCanvas(true);

		// we can block layer rendering because we are only targeting the transforms
		for (let layer of this.engine.getModel().getLayers()) {
			layer.allowRepaint(false);
		}

		this.initialCanvasX = this.engine.getModel().getOffsetX();
		this.initialCanvasY = this.engine.getModel().getOffsetY();
	}

	deactivated(next: State) {
		super.deactivated(next);
		for (let layer of this.engine.getModel().getLayers()) {
			layer.allowRepaint(true);
		}
	}

	fireMouseMoved(event: AbstractDisplacementStateEvent) {
		this.engine
			.getModel()
			.setOffset(this.initialCanvasX + event.displacementX, this.initialCanvasY + event.displacementY);
		this.engine.repaintCanvas();
	}
}
