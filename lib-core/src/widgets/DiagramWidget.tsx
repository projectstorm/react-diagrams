import * as React from 'react';
import { DiagramEngine } from '../DiagramEngine';
import * as _ from 'lodash';
import { LinkLayerWidget } from './layers/LinkLayerWidget';
import { NodeLayerWidget } from './layers/NodeLayerWidget';
import { AbstractMouseAction } from '../core-actions/AbstractMouseAction';
import { MoveItemsAction } from '../actions/move-items/MoveItemsAction';
import { SelectingAction } from '../actions/selecting-items/SelectingAction';
import { PointModel } from '../models/PointModel';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { MouseEvent } from 'react';
import { ActionFactoryActivationEvent } from '../core-actions/AbstractActionFactory';
import { AbstractAction } from '../core-actions/AbstractAction';
import { MoveItemsActionFactory } from '../actions/move-items/MoveItemsActionFactory';

export interface DiagramProps extends BaseWidgetProps {
	diagramEngine: DiagramEngine;

	// zoom
	allowCanvasZoom?: boolean;
	inverseZoom?: boolean;

	actionStartedFiring?: (action: AbstractAction) => boolean;
	actionStillFiring?: (action: AbstractAction) => void;
	actionStoppedFiring?: (action: AbstractAction) => void;

	deleteKeys?: number[];
}

export interface DiagramState {
	action: AbstractAction;
	diagramEngineListener: any;
}

export class DiagramWidget extends BaseWidget<DiagramProps, DiagramState> {
	onKeyUpPointer: (this: Window, ev: KeyboardEvent) => void = null;
	ref: React.RefObject<HTMLDivElement>;

	constructor(props: DiagramProps) {
		super('srd-diagram', props);

		this.ref = React.createRef();
		this.state = {
			action: null,
			diagramEngineListener: null
		};
	}

	componentWillUnmount() {
		this.props.diagramEngine.deregisterListener(this.state.diagramEngineListener);
		this.props.diagramEngine.setCanvas(null);
		window.removeEventListener('keyup', this.onKeyUpPointer);
		window.removeEventListener('mouseUp', this.onMouseUp);
		window.removeEventListener('mouseMove', this.onMouseMove);
	}

	componentWillReceiveProps(nextProps: DiagramProps) {
		if (this.props.diagramEngine !== nextProps.diagramEngine) {
			this.props.diagramEngine.deregisterListener(this.state.diagramEngineListener);
			const diagramEngineListener = nextProps.diagramEngine.registerListener({
				repaintCanvas: () => this.forceUpdate()
			});
			this.setState({ diagramEngineListener });
		}
	}

	registerCanvas() {
		this.props.diagramEngine.setCanvas(this.ref.current);
		this.props.diagramEngine.iterateListeners(list => {
			list.rendered && list.rendered();
		});
	}

	componentDidUpdate() {
		this.registerCanvas();
	}

	componentDidMount() {
		this.onKeyUpPointer = this.onKeyUp.bind(this);

		//add a keyboard listener
		this.setState({
			diagramEngineListener: this.props.diagramEngine.registerListener({
				repaintCanvas: () => {
					this.forceUpdate();
				}
			})
		});

		window.addEventListener('keyup', this.onKeyUpPointer, false);

		// dont focus the window when in test mode - jsdom fails
		if (process.env.NODE_ENV !== 'test') {
			window.focus();
		}

		this.registerCanvas();
	}

	fireAction() {
		if (this.state.action && this.props.actionStillFiring) {
			this.props.actionStillFiring(this.state.action);
		}
	}

	stopFiringAction(shouldSkipEvent?: boolean) {
		if (this.props.actionStoppedFiring && !shouldSkipEvent) {
			this.props.actionStoppedFiring(this.state.action);
		}
		this.setState({ action: null });
	}

	startFiringAction(action: AbstractAction) {
		var setState = true;
		if (this.props.actionStartedFiring) {
			setState = this.props.actionStartedFiring(action);
		}
		if (setState) {
			this.setState({ action: action });
		}
	}

	onMouseUp = event => {
		if (this.state.action && this.state.action instanceof AbstractMouseAction) {
			this.state.action.fireMouseUp(event);
		}
		this.stopFiringAction();
		document.removeEventListener('mousemove', this.onMouseMove);
		document.removeEventListener('mouseup', this.onMouseUp);
	};

	onMouseMove = event => {
		//select items so draw a bounding box
		if (this.state.action) {
			if (this.state.action && this.state.action instanceof AbstractMouseAction) {
				this.state.action.fireMouseMove(event);
			}
			this.fireAction();
			this.forceUpdate();
		}
	};

	onKeyUp = event => {
		//delete all selected
		if ((this.props.deleteKeys || [46, 8]).indexOf(event.keyCode) !== -1) {
			_.forEach(this.props.diagramEngine.getDiagramModel().getSelectedItems(), element => {
				//only delete items which are not locked
				if (!this.props.diagramEngine.isModelLocked(element)) {
					element.remove();
				}
			});
			this.forceUpdate();
		}
	};

	drawSelectionBox() {
		let dimensions = (this.state.action as SelectingAction).getBoxDimensions();
		return (
			<div
				className={this.bem('__selector')}
				style={{
					top: dimensions.top,
					left: dimensions.left,
					width: dimensions.width,
					height: dimensions.height
				}}
			/>
		);
	}

	getActionForEvent(event: MouseEvent): AbstractAction {
		event.persist();
		const { diagramEngine } = this.props;
		const model = diagramEngine.getMouseElement(event);

		const activateEvent: ActionFactoryActivationEvent = {
			selectedModel: model && model.model,
			selectedEntity: model && (model.element as HTMLElement),
			mouseEvent: event
		};

		for (let factory of diagramEngine.getActionFactories().getFactories()) {
			if (factory.activate(activateEvent)) {
				return factory.generateAction(event);
			}
		}
		return null;
	}

	render() {
		const diagramEngine = this.props.diagramEngine;
		const diagramModel = diagramEngine.getDiagramModel();

		return (
			<div
				{...this.getProps()}
				ref={this.ref}
				onWheel={event => {
					const allow = this.props.allowCanvasZoom == null ? true : this.props.allowCanvasZoom;
					if (allow) {
						event.stopPropagation();
						const oldZoomFactor = diagramModel.getZoomLevel() / 100;
						let scrollDelta = this.props.inverseZoom ? -event.deltaY : event.deltaY;
						//check if it is pinch gesture
						if (event.ctrlKey && scrollDelta % 1 !== 0) {
							/*Chrome and Firefox sends wheel event with deltaY that
                have fractional part, also `ctrlKey` prop of the event is true
                though ctrl isn't pressed
              */
							scrollDelta /= 3;
						} else {
							scrollDelta /= 60;
						}
						if (diagramModel.getZoomLevel() + scrollDelta > 10) {
							diagramModel.setZoomLevel(diagramModel.getZoomLevel() + scrollDelta);
						}

						const zoomFactor = diagramModel.getZoomLevel() / 100;

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
						const xFactor = (clientX - diagramModel.getOffsetX()) / oldZoomFactor / clientWidth;
						const yFactor = (clientY - diagramModel.getOffsetY()) / oldZoomFactor / clientHeight;

						diagramModel.setOffset(
							diagramModel.getOffsetX() - widthDiff * xFactor,
							diagramModel.getOffsetY() - heightDiff * yFactor
						);

						this.forceUpdate();
					}
				}}
				onMouseDown={event => {
					// try and get an action for this event
					const action = this.getActionForEvent(event);
					if (action) {
						if (action instanceof AbstractMouseAction) {
							const selected = diagramEngine.getMouseElement(event);
							action.fireMouseDown({
								mouseEvent: event,
								selectedEntity: selected && (selected.element as HTMLElement),
								selectedModel: selected && selected.model
							});
						}
						this.startFiringAction(action);
					}
					document.addEventListener('mousemove', this.onMouseMove);
					document.addEventListener('mouseup', this.onMouseUp);
				}}>
				<LinkLayerWidget
					diagramEngine={diagramEngine}
					pointAdded={(point: PointModel, event) => {
						document.addEventListener('mousemove', this.onMouseMove);
						document.addEventListener('mouseup', this.onMouseUp);
						event.stopPropagation();

						// TODO implement this better and more generic
						let action: MoveItemsAction = null;
						let fac: MoveItemsActionFactory = null;
						try {
							fac = diagramEngine.getActionFactories().getFactory<MoveItemsActionFactory>(MoveItemsActionFactory.NAME);
						} catch (e) {}
						if (fac) {
							action = fac.generateAction(event);
							action.fireMouseDown({
								selectedModel: point,
								selectedEntity: event.target as HTMLElement,
								mouseEvent: event
							});
							this.startFiringAction(action);
						}
					}}
				/>
				<NodeLayerWidget diagramEngine={diagramEngine} />
				{this.state.action instanceof SelectingAction && this.drawSelectionBox()}
			</div>
		);
	}
}
