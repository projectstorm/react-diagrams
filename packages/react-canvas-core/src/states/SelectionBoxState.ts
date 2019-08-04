import { AbstractDisplacementState, AbstractDisplacementStateEvent } from '../core-state/AbstractDisplacementState';
import { State } from '../core-state/State';
import { SelectionLayerModel } from '../entities/selection/SelectionLayerModel';

export class SelectionBoxState extends AbstractDisplacementState {
	layer: SelectionLayerModel;

	constructor() {
		super({
			name: 'selection-box'
		});
	}

	activated(previous: State) {
		super.activated(previous);
		this.layer = new SelectionLayerModel();
		this.engine.getModel().addLayer(this.layer);
	}

	deactivated(next: State) {
		super.deactivated(next);
		this.layer.remove();
		this.engine.repaintCanvas();
	}

	getBoxDimensions(event: AbstractDisplacementStateEvent): ClientRect {
		return {
			left: event.event.clientX > this.initialX ? this.initialX : event.event.clientX,
			top: event.event.clientY > this.initialY ? this.initialY : event.event.clientY,
			width: Math.abs(event.event.clientX - this.initialX),
			height: Math.abs(event.event.clientY - this.initialY),
			right: event.event.clientX < this.initialX ? this.initialX : event.event.clientX,
			bottom: event.event.clientY < this.initialY ? this.initialY : event.event.clientY
		};
	}

	fireMouseMoved(event: AbstractDisplacementStateEvent) {
		this.layer.setBox(this.getBoxDimensions(event));
		this.engine.repaintCanvas();
	}
}
