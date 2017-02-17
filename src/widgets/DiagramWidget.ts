import * as React from "react";
import {DiagramEngine} from "../DiagramEngine";
import {DiagramModel} from "../DiagramModel";
import * as _ from "lodash";
import {PointModel, NodeModel, BaseModel} from "../Common";
import {LinkLayerWidget} from "./LinkLayerWidget";
import {NodeLayerWidget} from "./NodeLayerWidget";

interface SelectionModel{
	model: BaseModel;
	initialX: number;
	initialY: number;
}

class BaseAction{
	mouseX: number;
	mouseY: number;
	ms: number;
	
	constructor(mouseX: number,mouseY: number){
		this.mouseX = mouseX;
		this.mouseY = mouseY;
		this.ms = (new Date()).getTime();
	}
}

class SelectingAction extends BaseAction{
	mouseX2: number;
	mouseY2: number;
	
	constructor(mouseX: number,mouseY: number){
		super(mouseX,mouseY);
		this.mouseX2 = mouseX;
		this.mouseY2 = mouseY;
	}
}

class MoveCanvasAction extends BaseAction{
	initialOffsetX: number;
	initialOffsetY: number;
	
	constructor(mouseX: number, mouseY: number, diagramModel: DiagramModel){
		super(mouseX,mouseY);
		this.initialOffsetX = diagramModel.getOffsetX();
		this.initialOffsetY = diagramModel.getOffsetY();
	}
}

class MoveItemsAction extends BaseAction{
	selectionModels: SelectionModel[];
	moved:boolean;
	constructor(mouseX: number,mouseY: number,selectionModels: SelectionModel[]){
		super(mouseX, mouseY);
		this.moved = false;
		this.selectionModels = selectionModels;
	}
}

interface DiagramProps {
	diagramEngine:DiagramEngine;
}

interface DiagramState {
	selectedPointID: any,
	action: BaseAction| null;
	mouseDownModel: BaseModel|null,
	listenerID: any,
	renderedNodes: boolean,
	windowListener: any,
	mouseDown: false
}

/**
 * @author Dylan Vorster
 */
export class DiagramWidget extends React.Component<DiagramProps, DiagramState> {

	constructor(props: DiagramProps) {
		super(props);
		this.state = {
			action: null,
			stateModel: null,
			mouseDownModel: null,
			selectedPointID: null,
			mouseDown: false,
			selectionModels:[],
			listenerID: null,
			renderedNodes: false,
			windowListener: null
		}
	}

	componentWillUnmount(){
		this.props.diagramEngine.setCanvas(null);
		window.removeEventListener('keydown',this.state.windowListener);
	}
	
	componentWillReceiveProps(nextProps: DiagramProps){
		if (this.props.diagramEngine.id !== nextProps.diagramEngine.id){
			this.setState({renderedNodes: false});
		}
	}
	
	/**
	 * Gets a model and element under the mouse cursor
	 */
	getMouseElement(event): {model: BaseModel, element: Element}{
		var target = event.target as Element;
		var diagramModel = this.props.diagramEngine.diagramModel;
		
		//is it a port
		var element = target.closest('.port[data-name]');
		if(element){
			var nodeElement = target.closest('.node[data-nodeid]') as HTMLElement;
			return {
				model: diagramModel.getNode(nodeElement.getAttribute('data-nodeid')).getPort(element.getAttribute('data-name')),
				element: element
			};
		}

		//look for a point
		element = target.closest('.point[data-id]');
		if(element){
			return {
				model: diagramModel.getLink(element.getAttribute('data-linkid')).getPointModel(element.getAttribute('data-id')),
				element: element
			};
		}
		
		//look for a node
		element = target.closest('.node[data-nodeid]');
		if(element){
			return {
				model: diagramModel.getNode(element.getAttribute('data-nodeid')),
				element: element
			}
		}
		
		return null;
	}
	
	componentDidMount(){
		this.props.diagramEngine.setCanvas(this.refs['canvas'] as Element);
		
		//TODO
		
		//add a keybaord listener
		this.setState({
			renderedNodes: true,
			windowListener: window.addEventListener('keydown',(event) => {
				
				//delete all selected
				if(event.keyCode === 46){
					_.forEach(this.props.diagramEngine.getDiagramModel().getSelectedItems(),(element) => {
						element.remove();
					});
				}
			})
		});
		window.focus();
	}
	

	render() {
		var diagramEngine = this.props.diagramEngine;
		var diagramModel = diagramEngine.getDiagramModel();
		
		return (
			React.DOM.div({
					ref:'canvas',
					className:'storm-diagrams-canvas',
					onWheel: (event) => {
                        event.preventDefault();
                        event.stopPropagation();
						diagramModel.setZoomLevel(diagramModel.getZoomLevel()+(event.deltaY/60));
					},
					onMouseMove: (event) => {
						
						//select items so draw a bounding box
						if (this.state.action instanceof SelectingAction){
							var relative = diagramEngine.getRelativePoint(event.pageX, event.pageY);
							
							
							_.forEach(diagramModel.getNodes(),(node) => {
								if (node.x > this.state.action.mouseX && node.x < relative.x && 
									node.y > this.state.action.mouseY && node.y < relative.y){
									node.setSelected(true);
								}
							});
							
							_.forEach(diagramModel.getLinks(),(link) => {
								var allSelected = true;
								_.forEach(link.points,(point) => {
									if (point.x > this.state.action.mouseX && point.x < relative.x && 
										point.y > this.state.action.mouseY && point.y < relative.y){
										point.setSelected(true);
									}else{
										allSelected = false;
									}
								});
								
								if (allSelected){
									link.setSelected(true);
								}
							})
							
							this.state.action.mouseX2 = relative.x;
							this.state.action.mouseY2 = relative.y;
							this.setState({action: this.state.action});
							return;
						}
						
						//translate the items on the canvas
						else if (this.state.action instanceof MoveItemsAction){
							_.forEach(this.state.action.selectionModels,(model) => {
								if (model.model instanceof NodeModel || model.model instanceof PointModel){
									model.model.x = model.initialX + ((event.pageX - this.state.action.mouseX) / (diagramModel.getZoomLevel()/100));
									model.model.y = model.initialY + ((event.pageY - this.state.action.mouseY) / (diagramModel.getZoomLevel()/100));
								}
							});
							this.forceUpdate();
						}
						
						//translate the actual canvas
						else if (this.state.action instanceof MoveCanvasAction){
							diagramModel.setOffset(
								this.state.action.initialOffsetX + ((event.pageX - this.state.action.mouseX) / (diagramModel.getZoomLevel()/100)),
								this.state.action.initialOffsetY+((event.pageY-this.state.action.mouseY)/(diagramModel.getZoomLevel()/100))
							);
							this.forceUpdate();
						}
					},
					onMouseDown: (event) =>{
						
						var model = this.getMouseElement(event);
						
						//its the canvas
						if(model === null){
							//is it a multiple selection
							if (event.shiftKey){
								var relative = diagramEngine.getRelativePoint(event.pageX, event.pageY);
								this.setState({
									action: new SelectingAction(
										relative.x, relative.y
									)
								});
							}
							
							//its a drag the canvas event
							else{
								var relative = diagramEngine.getRelativePoint(event.pageX, event.pageY);
								diagramModel.clearSelection();
								this.setState({
									action: new MoveCanvasAction(relative.x, relative.y, diagramModel)
								});
							}
						} else{
							if (!event.shiftKey && !model.model.isSelected()){
								console.log("clear selection");
								diagramModel.clearSelection();
							}
							model.model.setSelected(true);
							
							this.setState({
								action: new MoveItemsAction(event.pageX, event.pageY,diagramModel.getSelectedItems().map((item: PointModel | NodeModel) => {
									return {
										model: item,
										initialX: item.x,
										initialY: item.y,
									}
								}))
							});
						}
					},
					onMouseUp: (event) => {
						
//						var element = this.getMouseElement(event);
//						if (element.model && element.model.isSelected()){
//							
//						}
//						
//						
//						var standardClick = (new Date()).getTime()-this.state.action.ms < 10;
//						if (standardClick && !event.shiftKey){
//							var element = this.getMouseElement(event);
//							if (element){
//								diagramModel.clearSelection();
//								element.model.setSelected(true);
//							}
//						}
						
						
//						if(this.state.selectedPointID){
//							
//							var target = event.target as HTMLElement;
//							var element = target.closest('.port[data-name]') as HTMLElement;
//							if(element){
//								var nodeElement = target.closest('.node[data-nodeid]');
//								
//								//cant add link to self
//								if (this.state.selectedLink.source === nodeElement.getAttribute('data-nodeid')){
//									diagramModel.removeLink(this.state.selectedLink);
//								}
//								
//								//do the merge
//								else{
//									
//									var nodeObject = diagramModel.getNode(nodeElement.getAttribute('data-nodeid'));
//
//									//check if the port is allowed by using the factory
////									if(NodeFactory.isPortAllowed(
////										this.props.engine.getNode(this.state.selectedLink.source),
////										this.state.selectedLink.sourcePort,
////										nodeObject,element.dataset.name)){
//										
//									this.state.selectedLink.target = nodeElement.getAttribute('data-nodeid');
//										this.state.selectedLink.targetPort = element.getAttribute('data-name');
//										nodeObject.setSelected(true);
//									}
//								}
//							}
							this.setState({action: null});
						}
				},
				this.state.renderedNodes?
					React.createElement(LinkLayerWidget, {diagramEngine: diagramEngine}):null,
					React.createElement(NodeLayerWidget, {diagramEngine: diagramEngine}),
					this.state.action instanceof SelectingAction?
						React.DOM.div({
							className: 'selector',
							style: {
								top: this.state.action.mouseY,
								left: this.state.action.mouseX,
								width: this.state.action.mouseX2 - this.state.action.mouseX,
								height: this.state.action.mouseY2 - this.state.action.mouseY,
							}
						}):null
			)
		);
	}
}