import {Toolkit} from "./Toolkit";
import {BaseEnity, BaseListener} from "./BaseEntity";
import * as _ from "lodash";
/**
 * @author Dylan Vorster
 */
export class BaseModel extends BaseEnity<BaseListener>{
	selected: boolean;
	
	constructor(){
		super();
		this.id = Toolkit.UID();
		this.selected = false;
	}
	
	public getID(): string{
		return this.id
	}
	
	public isSelected(): boolean{
		return this.selected;
	}
	
	public setSelected(selected: boolean){
		this.selected = selected;
	}
	
	remove(){
		
	}
}

export class PointModel extends BaseModel{
	
	x:number;
	y:number;
	link: LinkModel;
	
	constructor(link: LinkModel,points: {x:number,y: number}){
		super();
		this.x = points.x;
		this.y = points.y;
		this.link = link;
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
}

export class LinkModel extends BaseModel{
	
	linkType: string;
	source;
	sourcePort;
	target;
	targetPort;
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
	}
	
	getPointModel(id: string): PointModel|null{
		for (var i = 0; i < this.points.length;i++){
			if (this.points[i].id === id){
				return this.points[i];
			}
		}
		return null;
	}
	
	setPoints(points: PointModel[]){
		this.points = points;
	}
	
	addPoint(pointModel:PointModel,index = 1){
		this.points.splice(index,0,pointModel);
	}
	
	getType(): string{
		return this.linkType;
	}
}

export class PortModel extends BaseModel{
	name: string;
	parentNode: NodeModel;
	
	constructor(name: string){
		super();
		this.name = name;
	}
}

export class NodeModel extends BaseModel{
	
	nodeType: string;
	canDelete: boolean;
	x: number;
	y: number;
	extras: {};
	ports: PortModel[];
	
	constructor(){
		super();
		this.canDelete = true;
		this.nodeType = "default";
		this.x = 0;
		this.y = 0;
		this.extras = {};
		this.ports = [];
	}
	
	getPort(name: string): PortModel | null{
		for (var i = 0; i < this.ports.length;i++){
			if (this.ports[i].name === name){
				return this.ports[i];
			}
		}
		return null;
	}
	
	getPorts(): PortModel[]{
		return this.ports;
	}
	
	addPort(port: PortModel){
		this.ports.push(port);
	}
	
	getType(): string{
		return this.nodeType;
	}
}