import { WheelEvent } from 'react';
import { Action, ActionEvent, InputType } from '../core-actions/Action';

export interface ZoomCanvasActionOptions {
	inverseZoom?: boolean;
}

export class ZoomCanvasAction extends Action {
	constructor(options: ZoomCanvasActionOptions = {}) {
		super({
			type: InputType.MOUSE_WHEEL,
			fire: (actionEvent: ActionEvent<WheelEvent>) => {
				const { event } = actionEvent;
				// we can block layer rendering because we are only targeting the transforms
				for (let layer of this.engine.getModel().getLayers()) {
					layer.allowRepaint(false);
				}

				const model = this.engine.getModel();
				event.stopPropagation();
				const oldZoomFactor = this.engine.getModel().getZoomLevel() / 100;
				let scrollDelta = options.inverseZoom ? -event.deltaY : event.deltaY;
				//check if it is pinch gesture
				if (event.ctrlKey && scrollDelta % 1 !== 0) {
					/*
						Chrome and Firefox sends wheel event with deltaY that
						have fractional part, also `ctrlKey` prop of the event is true
						though ctrl isn't pressed
					*/
					scrollDelta /= 3;
				} else {
					scrollDelta /= 60;
				}
				if (model.getZoomLevel() + scrollDelta > 10) {
					model.setZoomLevel(model.getZoomLevel() + scrollDelta);
				}

				const zoomFactor = model.getZoomLevel() / 100;

				const boundingRect = event.currentTarget.getBoundingClientRect();
				const clientWidth = boundingRect.width;
				const clientHeight = boundingRect.height;
				// compute difference between rect before and after scroll
				const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
				const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;
				// compute mouse coords relative to canvas
				const clientX = event.clientX - boundingRect.left;
				const clientY = event.clientY - boundingRect.top;

				// compute width and height increment factor
				const xFactor = (clientX - model.getOffsetX()) / oldZoomFactor / clientWidth;
				const yFactor = (clientY - model.getOffsetY()) / oldZoomFactor / clientHeight;

				model.setOffset(model.getOffsetX() - widthDiff * xFactor, model.getOffsetY() - heightDiff * yFactor);
				this.engine.repaintCanvas();

				// re-enable rendering
				for (let layer of this.engine.getModel().getLayers()) {
					layer.allowRepaint(true);
				}
			}
		});
	}
}
