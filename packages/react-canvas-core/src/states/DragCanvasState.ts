import { CanvasEngine } from '../CanvasEngine';
import { AbstractDisplacementState, AbstractDisplacementStateEvent } from '../core-state/AbstractDisplacementState';
import { State } from '../core-state/State';

export interface DragCanvasStateOptions {
	/**
	 * If enabled, the canvas is available to drag
	 */
	allowDrag?: boolean;
}

export class DragCanvasState<E extends CanvasEngine = CanvasEngine> extends AbstractDisplacementState<E> {
	// store this as we drag the canvas
	initialCanvasX: number;
	initialCanvasY: number;
	config: DragCanvasStateOptions;

	constructor(options: DragCanvasStateOptions = {}) {
		super({
			name: 'drag-canvas'
		});
		this.config = {
			allowDrag: true,
			...options
		};
		this.initialCanvasX = 0;
    this.initialCanvasY = 0;
	}

	async activated(prev) {
		super.activated(prev);
		this.engine.getModel().clearSelection();

		// we can block layer rendering because we are only targeting the transforms
		for (let layer of this.engine.getModel().getLayers()) {
			layer.allowRepaint(false);
		}

		this.initialCanvasX = this.engine.getModel().getOffsetX();
		this.initialCanvasY = this.engine.getModel().getOffsetY();
		await this.engine.repaintCanvas(true);
	}

	deactivated(next: State) {
		super.deactivated(next);
		for (let layer of this.engine.getModel().getLayers()) {
			layer.allowRepaint(true);
		}
	}

	fireMouseMoved(event: AbstractDisplacementStateEvent) {
		if (this.config.allowDrag) {
			this.engine
				.getModel()
				.setOffset(this.initialCanvasX + event.displacementX, this.initialCanvasY + event.displacementY);
			this.engine.repaintCanvas();
		}
	}
}
