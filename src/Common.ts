import {BaseEntity, BaseListener} from "./BaseEntity";
import * as _ from "lodash";

export interface BaseModelListener extends BaseListener{

	selectionChanged?(item: BaseModel<BaseModelListener>, isSelected:boolean): void;

	entityRemoved?(item:any): void;
}

/**
 * @author Dylan Vorster
 */
export class BaseModel<T extends BaseModelListener> extends BaseEntity<BaseModelListener>{

	selected: boolean;

	constructor(id?:string){
		super(id);
		this.selected = false;
	}

	deSerialize(ob){
		super.deSerialize(ob);
		this.selected = ob.selected;
	}

	serialize(){
		return _.merge(super.serialize(),{
			_class: this.constructor.name,
			selected: this.selected
		});
	}

	public getID(): string{
		return this.id
	}

	public isSelected(): boolean{
		return this.selected;
	}

	public setSelected(selected: boolean = true){
		this.selected = selected;
		this.iterateListeners((listener) => {
			if(listener.selectionChanged){
				listener.selectionChanged(this, selected);
			}
		});
	}

	remove(){
		this.iterateListeners((listener) => {
			if(listener.entityRemoved){
				listener.entityRemoved(this);
			}
		});
	}
}

export class PointModel extends BaseModel<BaseModelListener>{

	x:number;
	y:number;
	link: LinkModel;

	private _lockChangedListener: BaseListener;
	private _lockChangedListenerId: string | null;

	constructor(link: LinkModel,points: {x:number,y: number}){
		super();
		this.x = points.x;
		this.y = points.y;
		this.link = link;

		this._lockChangedListener = {
			lockChanged: () => {
				this.notifyLockedChanged();
			}
		};
		this._lockChangedListenerId = null;

		if (this.link){
			this._lockChangedListenerId = this.link.addListener(this._lockChangedListener);
		}
	}

	deSerialize(ob){
		super.deSerialize(ob);
		this.x = ob.x;
		this.y = ob.y;
	}

	serialize(){
		return _.merge(super.serialize(),{
			x: this.x,
			y: this.y
		});
	}

	remove(){
		super.remove();

		//clear references
		if (this.link){
			this.link.removeListener(this._lockChangedListenerId);
			this._lockChangedListenerId = null;

			this.link.removePoint(this);
		}
	}

	updateLocation(points: {x:number,y: number}){
		this.x = points.x;
		this.y = points.y;
	}

	getX():number{
		return this.x;
	}

	getY():number{
		return this.y;
	}

	getLink(): LinkModel{
		return this.link;
	}

	isLocked(): boolean{
		//a point is locked if its link is locked
		if (this.link.isLocked()){
			return true;
		}
		return super.isLocked();
	}
}

export interface LinkModelListener extends BaseModelListener{

	sourcePortChanged?(item:LinkModel,target: null|PortModel): void;

	targetPortChanged?(item:LinkModel,target: null|PortModel): void;
}

export class LinkModel extends BaseModel<LinkModelListener>{

	linkType: string;
	sourcePort: PortModel|null;
	targetPort: PortModel|null;
	points: PointModel[];
	extras: {};

	constructor(){
		super();
		this.linkType = 'default';
		this.points = [
			new PointModel(this,{x: 0,y: 0}),
			new PointModel(this,{x: 0,y: 0}),
		];
		this.extras = {};
		this.sourcePort = null;
		this.targetPort = null;
	}

	deSerialize(ob){
		super.deSerialize(ob);
		this.linkType = ob.type;
		this.extras = ob.extras;
		this.points = _.map(ob.points,(point: {x,y}) => {
			var p = new PointModel(this, {x: point.x,y:point.y});
			p.deSerialize(point);
			return p;
		})
	}

	serialize(){
		return _.merge(super.serialize(),{
			type: this.linkType,
			source: this.sourcePort ? this.sourcePort.getParent().id:null,
			sourcePort: this.sourcePort ? this.sourcePort.id:null,
			target: this.targetPort ? this.targetPort.getParent().id:null,
			targetPort: this.targetPort ? this.targetPort.id:null,
			points: _.map(this.points,(point) => {
				return point.serialize();
			}),
			extras: this.extras
		});
	}

	remove(){
		super.remove();
		if (this.sourcePort){
			this.sourcePort.removeLink(this);
		}
		if (this.targetPort){
			this.targetPort.removeLink(this);
		}
	}

	isLastPoint(point: PointModel){
		var index = this.getPointIndex(point);
		return index === this.points.length-1;
	}

	getPointIndex(point: PointModel){
		return this.points.indexOf(point);
	}

	getPointModel(id: string): PointModel|null{
		for (var i = 0; i < this.points.length;i++){
			if (this.points[i].id === id){
				return this.points[i];
			}
		}
		return null;
	}

	getFirstPoint(): PointModel{
		return this.points[0];
	}

	getLastPoint(): PointModel{
		return this.points[this.points.length-1];
	}

	setSourcePort(port: PortModel){
		port.addLink(this);
		this.sourcePort = port;
		this.iterateListeners((listener: LinkModelListener) => {
			listener.sourcePortChanged && listener.sourcePortChanged(this, port);
		});
	}

	getSourcePort(): PortModel{
		return this.sourcePort;
	}

	getTargetPort(): PortModel{
		return this.targetPort;
	}

	setTargetPort(port: PortModel){
		port.addLink(this);
		this.targetPort = port;
		this.iterateListeners((listener: LinkModelListener) => {
			listener.targetPortChanged && listener.targetPortChanged(this, port);
		});
	}

	getPoints(): PointModel[]{
		return this.points;
	}

	setPoints(points: PointModel[]){
		this.points = points;
	}

	removePoint(pointModel: PointModel){
		this.points.splice(this.getPointIndex(pointModel),1);
	}

	addPoint(pointModel:PointModel,index = 1){
		this.points.splice(index,0,pointModel);
	}

	getType(): string{
		return this.linkType;
	}
}

export class PortModel extends BaseModel<BaseModelListener>{
	name: string;
	parentNode: NodeModel;
	links: {[id: string]: LinkModel};

	private _lockChangedListener: BaseListener;
	private _lockChangedListenerId: string | null;

	deSerialize(ob){
		super.deSerialize(ob);
		this.name = ob.name;
	}

	serialize(){
		return _.merge(super.serialize(),{
			name: this.name,
			parentNode: this.parentNode.id,
			links: _.map(this.links,(link) => {
				return link.id;
			})
		});
	}

	constructor(name: string, id?:string){
		super(id);
		this.name = name;
		this.links = {};
		this.parentNode = null;

		this._lockChangedListener = {
			lockChanged: () => {
				this.notifyLockedChanged();
			}
		};
		this._lockChangedListenerId = null;
	}

	getName(): string{
		return this.name;
	}

	getParent(): NodeModel{
		return this.parentNode;
	}

	setParentNode(node: NodeModel){
		if (this.parentNode){
			this.parentNode.removeListener(this._lockChangedListenerId);
			this._lockChangedListenerId = null;
		}
		this.parentNode = node;
		if (this.parentNode){
			this._lockChangedListenerId = this.parentNode.addListener(this._lockChangedListener);
		}
	}

	removeLink(link: LinkModel){
		delete this.links[link.getID()];
	}

	addLink(link: LinkModel){
		this.links[link.getID()] = link;
	}

	getLinks(): {[id: string]: LinkModel}{
		return this.links;
	}

	isLocked(): boolean{
		//a port is locked if its parent node is locked
		if (this.parentNode && this.parentNode.isLocked()){
			return true;
		}
		return super.isLocked();
	}
}

export class NodeModel extends BaseModel<BaseModelListener>{

	nodeType: string;
	x: number;
	y: number;
	extras: {};
	ports:  {[s: string]:PortModel};

	constructor(nodeType: string = 'default', id?:string){
		super(id);
		this.nodeType = nodeType;
		this.x = 0;
		this.y = 0;
		this.extras = {};
		this.ports = {};
	}

	deSerialize(ob){
		super.deSerialize(ob);
		this.nodeType = ob.type;
		this.x = ob.x;
		this.y = ob.y;
		this.extras = ob.extras;
	}

	serialize(){
		return _.merge(super.serialize(),{
			type: this.nodeType,
			x: this.x,
			y: this.y,
			extras: this.extras,
			ports: _.map(this.ports,(port) => {
				return port.serialize()
			})
		});
	}

	remove(){
		super.remove();
		for (var i in this.ports){
			_.forEach(this.ports[i].getLinks(),(link) => {
				link.remove();
			});
		}
	}

	getPortFromID(id): PortModel | null{
		for (var i in this.ports){
			if (this.ports[i].id === id){
				return this.ports[i];
			}
		}
		return null;
	}

	getPort(name: string): PortModel | null{
		return this.ports[name];
	}

	getPorts(): {[s: string]:PortModel}{
		return this.ports;
	}

	removePort(port: PortModel){
		//clear the parent node reference
		if(this.ports[port.name]){
			this.ports[port.name].setParentNode(null);
			delete this.ports[port.name];
		}
	}

	addPort(port: PortModel): PortModel{
		port.setParentNode(this);
		this.ports[port.name] = port;
		return port;
	}

	getType(): string{
		return this.nodeType;
	}
}
