/**
 * @author Dylan Vorster
 */
import {LinkModel, LinkModelListener} from "../../models/LinkModel";
import {BaseEvent} from "../../BaseEntity";
import * as _ from "lodash";
import {PointModel} from "../../models/PointModel";
import {DiagramEngine} from "../../DiagramEngine";
import {DefaultLabelModel} from "./DefaultLabelModel";

export interface DefaultLinkModelListener extends LinkModelListener{

	colorChanged?(event: BaseEvent<DefaultLinkModel> & { color: null | string });

	widthChanged?(event: BaseEvent<DefaultLinkModel> & { width: 0 | number });
}

export class DefaultLinkModel extends LinkModel<DefaultLinkModelListener>{

	width: number;
	color: string;
	curvyness: number;

	constructor(type: string = 'default'){
		super(type);
		this.color = "rgb(0,192,255)";
		this.width = 3;
		this.curvyness = 50;
	}

	serialize(){
		return _.merge(super.serialize(), {
			width: this.width,
			color: this.color,
			curvyness: this.curvyness
		});
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.color = ob.color;
		this.width = ob.width;
		this.curvyness = ob.curvyness;
	}

	setLabel(label: string){
		let labelOb = new DefaultLabelModel();
		labelOb.setLabel(label);
		this.addLabel(labelOb);
	}

	setWidth(width: number){
		this.width = width;
		this.iterateListeners((listener: DefaultLinkModelListener, event: BaseEvent) => {
			listener.widthChanged && listener.widthChanged({ ...event, width: width });
		});
	}

	setColor(color: string){
		this.color = color;
		this.iterateListeners((listener: DefaultLinkModelListener, event: BaseEvent) => {
			listener.colorChanged && listener.colorChanged({ ...event, color: color });
		});
	}

}