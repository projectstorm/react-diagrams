import { AbstractDisplacementState, AbstractDisplacementStateEvent } from '../core-state/AbstractDisplacementState';

export class DragCanvasState extends AbstractDisplacementState {
	// store this as we drag the canvas
	initialCanvasX: number;
	initialCanvasY: number;

	constructor() {
		super({
			name: 'drag-canvas'
		});
	}

	activated(prev) {
		super.activated(prev);
		this.engine.getModel().clearSelection();
		this.engine.repaintCanvas();
		this.initialCanvasX = this.engine.getModel().getOffsetX();
		this.initialCanvasY = this.engine.getModel().getOffsetY();
	}

	fireMouseMoved(event: AbstractDisplacementStateEvent) {
		this.engine
			.getModel()
			.setOffset(this.initialCanvasX + event.displacementX, this.initialCanvasY + event.displacementY);
		this.engine.repaintCanvas();
	}
}
