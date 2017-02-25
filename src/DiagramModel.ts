import {LinkModel, NodeModel, BaseModel, PortModel} from "./Common";
import {BaseListener, BaseEntity} from "./BaseEntity";
import * as _ from "lodash";
import {DiagramEngine} from "./DiagramEngine";
/**
 * @author Dylan Vorster
 * 
 */
export interface DiagramListener extends BaseListener{
	
	nodesUpdated(): any;
	
	linksUpdated(): any;
	
	controlsUpdated(): any;
	
}
/**
 * 
 */
export class DiagramModel extends BaseEntity<DiagramListener>{
	
	//models
	links: {[s:string] : LinkModel};
	nodes: {[s:string] : NodeModel};
	
	//control variables
	offsetX: number;
	offsetY: number;
	zoom: number;
	
	constructor(){
		super();
		
		this.links = {};
		this.nodes = {};
		
		this.offsetX = 0;
		this.offsetY = 0;
		this.zoom = 100;
	}
	
	deSerializeDiagram(object: any, diagramEngine: DiagramEngine){
		this.deSerialize(object);
		
		this.offsetX = object.offsetX;
		this.offsetY = object.offsetY;
		this.zoom = object.zoom;
		
		//deserialize nodes
		_.forEach(object.nodes,(node) => {
			let nodeOb = diagramEngine.getInstanceFactory(node._class).getInstance() as NodeModel;
			nodeOb.deSerialize(node);
			
			//deserialize ports
			_.forEach(node.ports,(port) => {
				let portOb = diagramEngine.getInstanceFactory(port._class).getInstance() as PortModel;
				portOb.deSerialize(port);
				nodeOb.addPort(portOb);
			});
			
			this.addNode(nodeOb);
		});
		
		_.forEach(object.links,(link) => {
			let linkOb = diagramEngine.getInstanceFactory(link._class).getInstance() as LinkModel;
			linkOb.deSerialize(link);
			
			if(link.target){
				this.getNode(link.target).getPort(link.targetPort).addLink(linkOb);
			}
			
			if(link.source){
				this.getNode(link.source).getPort(link.sourcePort).addLink(linkOb);
			}
			
			this.addLink(linkOb);
		});
	}
	
	serializeDiagram(){
		return _.merge(this.serialize(),{
			offsetX: this.offsetX,
			offsetY: this.offsetY,
			zoom: this.zoom,
			links: _.map(this.links,(link) => {
				return link.serialize();
			}),
			nodes: _.map(this.nodes,(link) => {
				return link.serialize();
			}),
		});
	}
	
	clearSelection(ignore: BaseModel|null = null){
		_.forEach(this.getSelectedItems(),(element) => {
			if (ignore && ignore.getID() === element.getID()){
				return;
			}
			element.setSelected(false); //TODO dont fire the listener
		});
	}
	
	getSelectedItems(): BaseModel[]{
		var items  = [];
		
		//find all nodes
		items = items.concat(_.filter(this.nodes,(node) => {
			return node.isSelected();
		}));
		
		//find all points
		items = items.concat(_.filter(_.flatMap(this.links,(node) => {
			return node.points;
		}),(port) => {
			return port.isSelected();
		}));
		
		//find all links
		return items.concat(_.filter(this.links,(link) => {
			return link.isSelected();
		}));
	}
	
	setZoomLevel(zoom:number){
		this.zoom = zoom;
		this.itterateListeners((listener) => {
			listener.controlsUpdated();
		});
	}
	
	setOffset(offsetX: number, offsetY: number){
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.itterateListeners((listener) => {
			listener.controlsUpdated();
		});
	}
	
	setOffsetX(offsetX: number){
		this.offsetX = offsetX;
		this.itterateListeners((listener) => {
			listener.controlsUpdated();
		});
	}
	setOffsetY(offsetY: number){
		this.offsetX = offsetY;
		this.itterateListeners((listener) => {
			listener.controlsUpdated();
		});
	}
	
	getOffsetY(){
		return this.offsetY;
	}
	
	getOffsetX(){
		return this.offsetX;
	}
	
	getZoomLevel(){
		return this.zoom;
	}
	
	getNode(node: string | NodeModel): NodeModel|null{
		if (node instanceof NodeModel){
			return node;
		}
		if (!this.nodes[node]){
			return null;
		}
		return this.nodes[node];
	}
	
	getLink(link: string | LinkModel): LinkModel|null{
		if (link instanceof LinkModel){
			return link;
		}
		if(!this.links[link]){
			return null;
		}
		return this.links[link];
	}
	
	addLink(link: LinkModel): LinkModel{
		link.addListener({
			entityRemoved: () => {
				this.removeLink(link);
			}
		});
		this.links[link.getID()] = link;
		this.itterateListeners((listener) => {
			listener.linksUpdated();
		});
		return link
	}
	
	addNode(node: NodeModel): NodeModel{
		node.addListener({
			entityRemoved: () => {
				this.removeNode(node);
			}
		});
		this.nodes[node.getID()] = node;
		this.itterateListeners((listener) => {
			listener.nodesUpdated();
		});
		return node;
	}
	
	removeLink(link: LinkModel | string){
		if (link instanceof LinkModel){
			delete this.links[link.getID()];
			this.itterateListeners((listener) => {
				listener.linksUpdated();
			});
			return;
		}
		delete this.links[''+link];
		this.itterateListeners((listener) => {
			listener.linksUpdated();
		});
	}
	removeNode(node: NodeModel | string){
		if (node instanceof NodeModel){
			delete this.nodes[node.getID()];
			this.itterateListeners((listener) => {
				listener.nodesUpdated();
			});
			return;
		}
	
		delete this.nodes[''+node];
		this.itterateListeners((listener) => {
			listener.nodesUpdated();
		});
	}
	
	getLinks():{[s:string] : LinkModel} {
		return this.links;
	}
	
	getNodes(): {[s: string]: NodeModel}{
		return this.nodes;
	}
}