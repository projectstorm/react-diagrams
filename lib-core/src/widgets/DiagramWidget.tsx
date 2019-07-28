import * as React from 'react';
import { DiagramEngine } from '../DiagramEngine';
import * as _ from 'lodash';
import { LinkLayerWidget } from './layers/LinkLayerWidget';
import { NodeLayerWidget } from './layers/NodeLayerWidget';
import { BaseMouseAction } from '../actions/BaseMouseAction';
import { MoveCanvasAction } from '../actions/MoveCanvasAction';
import { MoveItemsAction } from '../actions/MoveItemsAction';
import { SelectingAction } from '../actions/SelectingAction';
import { PointModel } from '../models/PointModel';
import { PortModel } from '../models/PortModel';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { MouseEvent } from 'react';

export interface DiagramProps extends BaseWidgetProps {
	diagramEngine: DiagramEngine;

	allowLooseLinks?: boolean;
	allowCanvasTranslation?: boolean;
	allowCanvasZoom?: boolean;
	inverseZoom?: boolean;
	maxNumberPointsPerLink?: number;
	smartRouting?: boolean;

	actionStartedFiring?: (action: BaseMouseAction) => boolean;
	actionStillFiring?: (action: BaseMouseAction) => void;
	actionStoppedFiring?: (action: BaseMouseAction) => void;

	deleteKeys?: number[];
}

export interface DiagramState {
	action: BaseMouseAction | null;
	windowListener: any;
	diagramEngineListener: any;
}

/**
 * @author Dylan Vorster
 */
export class DiagramWidget extends BaseWidget<DiagramProps, DiagramState> {
	public static defaultProps: DiagramProps = {
		diagramEngine: null,
		allowLooseLinks: true,
		allowCanvasTranslation: true,
		allowCanvasZoom: true,
		inverseZoom: false,
		maxNumberPointsPerLink: Infinity, // backwards compatible default
		smartRouting: false,
		deleteKeys: [46, 8]
	};

	onKeyUpPointer: (this: Window, ev: KeyboardEvent) => void = null;
	ref: React.RefObject<HTMLDivElement>;

	constructor(props: DiagramProps) {
		super('srd-diagram', props);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.ref = React.createRef();
		this.state = {
			action: null,
			wasMoved: false,
			renderedNodes: false,
			windowListener: null,
			diagramEngineListener: null,
			document: null
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

	startFiringAction(action: BaseMouseAction) {
		var setState = true;
		if (this.props.actionStartedFiring) {
			setState = this.props.actionStartedFiring(action);
		}
		if (setState) {
			this.setState({ action: action });
		}
	}

	onMouseMove(event) {
		//select items so draw a bounding box
		if (this.state.action) {
			this.state.action.fireMouseMove(event);
			this.fireAction();
			this.forceUpdate();
		}
	}

	onKeyUp(event) {
		//delete all selected
		if (this.props.deleteKeys.indexOf(event.keyCode) !== -1) {
			_.forEach(this.props.diagramEngine.getDiagramModel().getSelectedItems(), element => {
				//only delete items which are not locked
				if (!this.props.diagramEngine.isModelLocked(element)) {
					element.remove();
				}
			});
			this.forceUpdate();
		}
	}

	onMouseUp(event) {
		if (this.state.action) {
			this.state.action.fireMouseUp(event);
		}
		this.props.diagramEngine.clearRepaintEntities();
		this.stopFiringAction();
		document.removeEventListener('mousemove', this.onMouseMove);
		document.removeEventListener('mouseup', this.onMouseUp);
	}

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

	getActionForEvent(event: MouseEvent): BaseMouseAction {
		this.props.diagramEngine.clearRepaintEntities();
		const { diagramEngine } = this.props;
		const model = diagramEngine.getMouseElement(event);
		const relative = diagramEngine.getRelativePoint(event.clientX, event.clientY);

		// the canvas was selected
		if (model === null) {
			// is it a multiple selection
			if (event.shiftKey) {
				return new SelectingAction(relative.x, relative.y, diagramEngine);
			} else {
				// its a drag the canvas event
				return new MoveCanvasAction(event.clientX, event.clientY, diagramEngine.getDiagramModel());
			}
		}
		// its a port element, we want to drag a link
		else if (model.model instanceof PortModel) {
			if (!this.props.diagramEngine.isModelLocked(model.model)) {
				return new MoveItemsAction(event.clientX, event.clientY, diagramEngine, this.props.allowLooseLinks);
			} else {
				diagramEngine.getDiagramModel().clearSelection();
			}
		}
		// its some or other element, probably want to move it
		if (!event.shiftKey && !model.model.isSelected()) {
			diagramEngine.getDiagramModel().clearSelection();
		}
		return new MoveItemsAction(event.clientX, event.clientY, diagramEngine, this.props.allowLooseLinks);
	}

	render() {
		var diagramEngine = this.props.diagramEngine;
		diagramEngine.setMaxNumberPointsPerLink(this.props.maxNumberPointsPerLink);
		var diagramModel = diagramEngine.getDiagramModel();

		return (
			<div
				{...this.getProps()}
				ref={this.ref}
				onWheel={event => {
					if (this.props.allowCanvasZoom) {
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

						diagramEngine.enableRepaintEntities([]);
						this.forceUpdate(() => {
							this.props.diagramEngine.clearRepaintEntities();
						});
					}
				}}
				onMouseDown={event => {
					diagramEngine.clearRepaintEntities();
					// try and get an action for this event
					const action = this.getActionForEvent(event);
					if (action) {
						action.fireMouseDown(event);
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
						diagramModel.clearSelection(point);
						const action = new MoveItemsAction(event.clientX, event.clientY, diagramEngine, this.props.allowLooseLinks);
						action.fireMouseDown(event);
						this.startFiringAction(action);
					}}
				/>
				<NodeLayerWidget diagramEngine={diagramEngine} />
				{this.state.action instanceof SelectingAction && this.drawSelectionBox()}
			</div>
		);
	}
}
