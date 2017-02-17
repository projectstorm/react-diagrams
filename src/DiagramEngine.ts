import {NodeWidgetFactory, LinkWidgetFactory} from "./WidgetFactories";
import {LinkModel, NodeModel, BaseModel, PortModel} from "./Common";
import {BaseEnity, BaseListener} from "./BaseEntity";
import {DiagramModel} from "./DiagramModel";
import * as React from "react";
import * as _ from "lodash";
/**
 * @author Dylan Vorster
 */
export interface DiagramEngineListener extends BaseListener{
	
	nodeFactoriesUpdated(): any;
	
	linkFactoriesUpdated(): any;
}

/**
 * 
 */
export class DiagramEngine extends BaseEnity<DiagramEngineListener>{
	
	nodeFactories: {[s: string]:NodeWidgetFactory};
	linkFactories: {[s: string]:LinkWidgetFactory};
	diagramModel: DiagramModel;
	canvas: Element;
	paintableWidgets: {};
	
	constructor(){
		super();
		this.diagramModel = new DiagramModel();
		this.nodeFactories = {};
		this.linkFactories = {};
		this.canvas = null;
		this.paintableWidgets = null;
	}
	
	clearRepaintEntities(){
		this.paintableWidgets = {};
	}
	
	enableRepaintEntities(entities: BaseModel[]){
		this.paintableWidgets = {};
		entities.forEach((entity) => {
			
			//if a node is requested to repaint, add all of its links
			if (entity instanceof NodeModel){
				_.forEach(entity.getPorts(),(port) => {
					_.forEach(port.getLinks(),(link) => {
						this.paintableWidgets[link.getID()] = true;
					});
				});
			}
			
			this.paintableWidgets[entity.getID()] = true;
		});
	}
	
	canEntityRepaint(baseModel: BaseModel){
		//no rules applied, allow repaint
		if(this.paintableWidgets === null){
			return true;
		}
		
		return this.paintableWidgets[baseModel.getID()] !== undefined;
	}
	
	setCanvas(canvas: Element| null){
		this.canvas = canvas;
	}
	
	setDiagramModel(model: DiagramModel){
		this.diagramModel = model;
	}
	
	getDiagramModel(): DiagramModel{
		return this.diagramModel;
	}
	
	getNodeFactories(): {[s: string]:NodeWidgetFactory}{
		return this.nodeFactories;
	}
	
	getLinkFactories(): {[s: string]:LinkWidgetFactory}{
		return this.linkFactories;
	}
	
	registerNodeFactory(factory: NodeWidgetFactory){
		this.nodeFactories[factory.getType()] = factory;
		this.itterateListeners((listener) => {
			listener.nodeFactoriesUpdated();
		});
	}
	
	registerLinkFactory(factory: LinkWidgetFactory){
		this.linkFactories[factory.getType()] = factory;
		this.itterateListeners((listener) => {
			listener.linkFactoriesUpdated();
		});
	}
	
	getFactoryForNode(node: NodeModel): NodeWidgetFactory | null{
		if (this.nodeFactories[node.getType()]){
			return this.nodeFactories[node.getType()];
		}
		console.log("cannot find widget factory for node of type: [" + node.getType()+"]");
		return null;
	}
	
	getFactoryForLink(link: LinkModel): LinkWidgetFactory | null{
		if (this.linkFactories[link.getType()]){
			return this.linkFactories[link.getType()];
		}
		console.log("cannot find widget factory for link of type: [" + link.getType()+"]");
		return null;
	}
	
	generateWidgetForLink(link: LinkModel): JSX.Element|null{
		var linkFactory = this.getFactoryForLink(link);
		if(!linkFactory){
			throw "Cannot find link factory for link: " + link.getType();
		}
		return linkFactory.generateReactWidget(this,link);
	}
	
	generateWidgetForNode(node: NodeModel): JSX.Element|null{
		var nodeFactory = this.getFactoryForNode(node);
		if(!nodeFactory){
			throw "Cannot find widget factory for node: " + node.getType();
		}
		return nodeFactory.generateReactWidget(this,node);
	}
	
	getRelativeMousePoint(event): {x:number,y:number}{
		var point = this.getRelativePoint(event.pageX,event.pageY);
		return {
			x: (point.x / (this.diagramModel.getZoomLevel() / 100.0)) - this.diagramModel.getOffsetX(),
			y: (point.y / (this.diagramModel.getZoomLevel() / 100.0)) - this.diagramModel.getOffsetY()
		};
	}

	getRelativePoint(x,y){
		var canvasRect = this.canvas.getBoundingClientRect();
		return {x: x-canvasRect.left,y:y-canvasRect.top};
	}
	
	getNodePortElement(port: PortModel): any{
		var selector = this.canvas.querySelector('.port[data-name="' + port.getName() + '"][data-nodeid="' + port.getParent().getID()+'"]');
		if(selector === null){
			throw "Cannot find Node Port element with nodeID: [" + port.getParent().getID()+"] and name: ["+port.getName()+"]";
		}
		return selector;
	}
	
	getPortCenter(port: PortModel){
		var sourceElement = this.getNodePortElement(port);
		var sourceRect = sourceElement.getBoundingClientRect();

		var rel = this.getRelativePoint(sourceRect.left,sourceRect.top);

		return {
			x: ((sourceElement.offsetWidth / 2) + rel.x / (this.diagramModel.getZoomLevel() / 100.0)) - this.diagramModel.getOffsetX(),
			y: ((sourceElement.offsetHeight/2)+rel.y/(this.diagramModel.getZoomLevel()/100.0)) - this.diagramModel.getOffsetY()
		};
	}
	
}