import { BaseModel, BaseModelListener } from "./BaseModel";
import { LinkModel } from "./LinkModel";
import * as _ from "lodash";

export class PointModel extends BaseModel<BaseModelListener> {
	x: number;
	y: number;
	link: LinkModel;

	constructor(link: LinkModel, points: { x: number; y: number }) {
		super();
		this.x = points.x;
		this.y = points.y;
		this.link = link;
	}

	getSelectedEntities() {
		if (super.isSelected() && !this.isConnectedToPort()) {
			return [this];
		}
		return [];
	}

	isConnectedToPort(): boolean {
		return this.link.getPortForPoint(this) !== null;
	}

	deSerialize(ob) {
		super.deSerialize(ob);
		this.x = ob.x;
		this.y = ob.y;
	}

	serialize() {
		return _.merge(super.serialize(), {
			x: this.x,
			y: this.y
		});
	}

	remove() {
		//clear references
		if (this.link) {
			this.link.removePoint(this);
		}
		super.remove();
	}

	updateLocation(points: { x: number; y: number }) {
		this.x = points.x;
		this.y = points.y;
	}

	getX(): number {
		return this.x;
	}

	getY(): number {
		return this.y;
	}

	getLink(): LinkModel {
		return this.link;
	}
	
	isLocked() {
		return super.isLocked() || this.getLink().isLocked();
	}
}
