import * as React from "react";
import {DiagramEngine} from "../DiagramEngine";
import * as _ from "lodash";
import {PointModel, NodeModel, BaseModel, BaseModelListener, LinkModel, PortModel} from "../Common";
import {LinkLayerWidget} from "./LinkLayerWidget";
import {NodeLayerWidget} from "./NodeLayerWidget";
import {Toolkit} from "../Toolkit";
import {BaseAction, MoveCanvasAction, MoveItemsAction, SelectingAction} from "../CanvasActions";

export interface SelectionModel {
	model: BaseModel<BaseModelListener>;
	initialX: number;
	initialY: number;
}

export interface DiagramProps {
	diagramEngine: DiagramEngine;

	allowLooseLinks?: boolean;
	allowCanvasTranslation?: boolean;
	allowCanvasZoom?: boolean;

	actionStartedFiring?: (action: BaseAction) => boolean;
	actionStillFiring?: (action: BaseAction) => void;
	actionStoppedFiring?: (action: BaseAction) => void;

	deleteKeys?: number[];
}

export interface DiagramState {
	action: BaseAction | null;
	wasMoved: boolean,
	renderedNodes: boolean,
	windowListener: any,
	diagramEngineListener: any,
	document: any
}

/**
 * @author Dylan Vorster
 */
export class DiagramWidget extends React.Component<DiagramProps, DiagramState> {

	public static defaultProps: DiagramProps = {
		diagramEngine: null,
		allowLooseLinks: true,
		allowCanvasTranslation: true,
		allowCanvasZoom: true,
		deleteKeys: [46, 8]
	};

	constructor(props: DiagramProps) {
		super(props);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.state = {
			action: null,
			wasMoved: false,
			renderedNodes: false,
			windowListener: null,
			diagramEngineListener: null,
			document: null
		}
	}

	onKeyUpPointer: null;

	componentWillUnmount() {
		this.props.diagramEngine.removeListener(this.state.diagramEngineListener);
		this.props.diagramEngine.setCanvas(null);
		window.removeEventListener('keyup', this.onKeyUpPointer);
		window.removeEventListener('mouseUp', this.onMouseUp);
		window.removeEventListener('mouseMove', this.onMouseMove);
	}

	componentWillUpdate(nextProps: DiagramProps) {
		if (this.props.diagramEngine.diagramModel.id !== nextProps.diagramEngine.diagramModel.id) {
			this.setState({renderedNodes: false});
			nextProps.diagramEngine.diagramModel.rendered = true;
		}
		if (!nextProps.diagramEngine.diagramModel.rendered) {
			this.setState({renderedNodes: false});
			nextProps.diagramEngine.diagramModel.rendered = true;
		}
	}

	componentDidUpdate() {
		if (!this.state.renderedNodes) {
			this.setState({
				renderedNodes: true
			});
		}
	}

	componentDidMount() {

		this.onKeyUpPointer = this.onKeyUp.bind(this);

		//add a keyboard listener
		this.setState({
			document: document,
			renderedNodes: true,
			diagramEngineListener: this.props.diagramEngine.addListener({
				repaintCanvas: () => {
					this.forceUpdate();
				}
			}),
		});

		window.addEventListener('keyup', this.onKeyUpPointer, false);

		window.focus();
	}

	/**
	 * Gets a model and element under the mouse cursor
	 */
	getMouseElement(event): { model: BaseModel<BaseModelListener>, element: Element } {
		var target = event.target as Element;
		var diagramModel = this.props.diagramEngine.diagramModel;

		//is it a port
		var element = Toolkit.closest(target, '.port[data-name]');
		if (element) {
			var nodeElement = Toolkit.closest(target, '.node[data-nodeid]') as HTMLElement;
			return {
				model: diagramModel.getNode(nodeElement.getAttribute('data-nodeid')).getPort(element.getAttribute('data-name')),
				element: element
			};
		}

		//look for a point
		element = Toolkit.closest(target, '.point[data-id]');
		if (element) {
			return {
				model: diagramModel.getLink(element.getAttribute('data-linkid')).getPointModel(element.getAttribute('data-id')),
				element: element
			};
		}

		//look for a link
		element = Toolkit.closest(target, '[data-linkid]');
		if (element) {
			return {
				model: diagramModel.getLink(element.getAttribute('data-linkid')),
				element: element
			};
		}

		//look for a node
		element = Toolkit.closest(target, '.node[data-nodeid]');
		if (element) {
			return {
				model: diagramModel.getNode(element.getAttribute('data-nodeid')),
				element: element
			}
		}

		return null;
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
		this.setState({action: null});
	}

	startFiringAction(action: BaseAction) {
		var setState = true;
		if (this.props.actionStartedFiring) {
			setState = this.props.actionStartedFiring(action);
		}
		if (setState) {
			this.setState({action: action});
		}
	}

	onMouseMove(event) {
		var diagramEngine = this.props.diagramEngine;
		var diagramModel = diagramEngine.getDiagramModel();
		//select items so draw a bounding box
		if (this.state.action instanceof SelectingAction) {
			var relative = diagramEngine.getRelativePoint(event.clientX, event.clientY);

			_.forEach(diagramModel.getNodes(), (node) => {
				if ((this.state.action as SelectingAction).containsElement(node.x, node.y, diagramModel)) {
					node.setSelected(true);
				}
			});

			_.forEach(diagramModel.getLinks(), (link) => {
				var allSelected = true;
				_.forEach(link.points, (point) => {
					if ((this.state.action as SelectingAction).containsElement(point.x, point.y, diagramModel)) {
						point.setSelected(true);
					} else {
						allSelected = false;
					}
				});

				if (allSelected) {
					link.setSelected(true);
				}
			})

			this.state.action.mouseX2 = relative.x;
			this.state.action.mouseY2 = relative.y;

			this.fireAction();
			this.setState({action: this.state.action});
			return;
		}

		//translate the items on the canvas
		else if (this.state.action instanceof MoveItemsAction) {
			if (!this.state.wasMoved) {
				this.setState({...this.state, wasMoved: true});
			}
			_.forEach(this.state.action.selectionModels, (model) => {
				if (model.model instanceof NodeModel || model.model instanceof PointModel) {
					model.model.x = diagramModel.getGridPosition(model.initialX + ((event.clientX - this.state.action.mouseX) / (diagramModel.getZoomLevel() / 100)));
					model.model.y = diagramModel.getGridPosition(model.initialY + ((event.clientY - this.state.action.mouseY) / (diagramModel.getZoomLevel() / 100)));
				}
			});
			this.fireAction();
			this.forceUpdate();
		}

		//translate the actual canvas
		else if (this.state.action instanceof MoveCanvasAction) {
			if (this.props.allowCanvasTranslation) {
				diagramModel.setOffset(
					this.state.action.initialOffsetX + ((event.clientX - this.state.action.mouseX) / (diagramModel.getZoomLevel() / 100)),
					this.state.action.initialOffsetY + ((event.clientY - this.state.action.mouseY) / (diagramModel.getZoomLevel() / 100))
				);
				this.fireAction();
				this.forceUpdate();
			}
		}
	}

	onKeyUp(event){

		//delete all selected
		if (this.props.deleteKeys.indexOf(event.keyCode) !== -1) {
			_.forEach(this.props.diagramEngine.getDiagramModel().getSelectedItems(), (element) => {

				//only delete items which are not locked
				if (!this.props.diagramEngine.isModelLocked(element)) {
					element.remove();
				}
			});
			this.forceUpdate();
		}
	}

	onMouseUp(event) {
		var diagramEngine = this.props.diagramEngine;
		//are we going to connect a link to something?
		if (this.state.action instanceof MoveItemsAction) {
			var element = this.getMouseElement(event);
			var linkConnected = false;
			_.forEach(this.state.action.selectionModels, (model) => {

				//only care about points connecting to things
				if (!(model.model instanceof PointModel)) {
					return;
				}

				if (element && element.model instanceof PortModel) {
					linkConnected = true;
					let link = model.model.getLink();
					link.setTargetPort(element.model);
				}
			});

			//do we want to allow loose links on the diagram model or not
			if (!linkConnected && !this.props.allowLooseLinks) {
				_.forEach(this.state.action.selectionModels, (model) => {

					//only care about points connecting to things
					if (!(model.model instanceof PointModel)) {
						return;
					}

					var link = model.model.getLink();
					if (link.isLastPoint(model.model)) {
						link.remove();
					}
				});
			}
			diagramEngine.clearRepaintEntities();
			this.stopFiringAction(!this.state.wasMoved);

		} else {
			diagramEngine.clearRepaintEntities();
			this.stopFiringAction();
		}

		this.state.document.removeEventListener('mousemove', this.onMouseMove);
		this.state.document.removeEventListener('mouseup', this.onMouseUp);
	}

	drawSelectionBox(){
		let dimensions = (this.state.action as SelectingAction).getBoxDimensions();
		return (
			<div
				className="selector"
				style={{
					top: dimensions.top,
					left: dimensions.left,
					width: dimensions.width,
					height: dimensions.height,
				}}
			/>
		);
	}

	render() {
		var diagramEngine = this.props.diagramEngine;
		var diagramModel = diagramEngine.getDiagramModel();

		return (
			<div
				ref={(ref) => {
					if(ref){
						this.props.diagramEngine.setCanvas(ref);
					}
				}}
				className="storm-diagrams-canvas"
				onWheel={(event) => {
					if (this.props.allowCanvasZoom) {
						event.preventDefault();
						event.stopPropagation();
						diagramModel.setZoomLevel(diagramModel.getZoomLevel() + (event.deltaY / 60));
						diagramEngine.enableRepaintEntities([]);
						this.forceUpdate();
						setTimeout(() => {
							this.forceUpdate();
						}, 100)
					}
				}}
				onMouseDown={(event) => {
					this.setState({...this.state, wasMoved: false});

					diagramEngine.clearRepaintEntities();
					var model = this.getMouseElement(event);
					//the canvas was selected
					if (model === null) {
						//is it a multiple selection
						if (event.shiftKey) {
							var relative = diagramEngine.getRelativePoint(event.clientX, event.clientY);
							this.startFiringAction(new SelectingAction(relative.x, relative.y));
						}

						//its a drag the canvas event
						else {
							diagramModel.clearSelection();
							this.startFiringAction(new MoveCanvasAction(event.clientX, event.clientY, diagramModel));
						}
					}

					//its a port element, we want to drag a link
					else if (model.model instanceof PortModel) {
						var relative = diagramEngine.getRelativeMousePoint(event);
						var link = new LinkModel();
						link.setSourcePort(model.model);

						link.getFirstPoint().updateLocation(relative)
						link.getLastPoint().updateLocation(relative);

						diagramModel.clearSelection();
						link.getLastPoint().setSelected(true);
						diagramModel.addLink(link);

						this.startFiringAction(new MoveItemsAction(event.clientX, event.clientY, diagramEngine));
					}
					//its some or other element, probably want to move it
					else {
						if (!event.shiftKey && !model.model.isSelected()) {
							diagramModel.clearSelection();
						}
						model.model.setSelected(true);

						this.startFiringAction(new MoveItemsAction(event.clientX, event.clientY, diagramEngine));
					}
					this.state.document.addEventListener('mousemove', this.onMouseMove);
					this.state.document.addEventListener('mouseup', this.onMouseUp);
				}}
			>
				{
					this.state.renderedNodes &&
						<LinkLayerWidget diagramEngine={diagramEngine} pointAdded={(point: PointModel, event) => {
							this.state.document.addEventListener('mousemove', this.onMouseMove);
							this.state.document.addEventListener('mouseup', this.onMouseUp);
							event.stopPropagation();
							diagramModel.clearSelection(point);
							this.setState({
								action: new MoveItemsAction(event.clientX, event.clientY, diagramEngine)
							});
						}}
					/>
				}
				<NodeLayerWidget diagramEngine={diagramEngine} />
				{
					this.state.action instanceof SelectingAction &&
						this.drawSelectionBox()
				}
			</div>
		);
	}
}
