/**
 * @author Dylan Vorster
 */
import {LinkModel, LinkModelListener} from "../models/LinkModel";
import {BaseEvent} from "../BaseEntity";
import * as _ from "lodash";

export interface DefaultLinkModelListener extends LinkModelListener{

	colorChanged?(event: BaseEvent<DefaultLinkModel> & { color: null | string });

	widthChanged?(event: BaseEvent<DefaultLinkModel> & { width: 0 | number });
}

export class DefaultLinkModel extends LinkModel<DefaultLinkModelListener>{

	width: number;
	color: string;
	curvyness: number;

	constructor(type: string = 'default'){
		super();
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

	deSerialize(ob) {
		super.deSerialize(ob);
		this.color = ob.color;
		this.width = ob.width;
		this.curvyness = ob.curvyness;
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