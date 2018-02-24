import { BaseModel, BaseModelListener } from "./BaseModel";
import { LinkModel } from "./LinkModel";
import * as _ from "lodash";
import { DiagramEngine } from "../DiagramEngine";

export class PointModel extends BaseModel<LinkModel, BaseModelListener> {
	x: number;
	y: number;

	constructor(link: LinkModel, points: { x: number; y: number }) {
		super();
		this.x = points.x;
		this.y = points.y;
		this.parent = link;
	}

	getSelectedEntities() {
		if (super.isSelected() && !this.isConnectedToPort()) {
			return [this];
		}
		return [];
	}

	isConnectedToPort(): boolean {
		return this.parent.getPortForPoint(this) !== null;
	}

	getLink(): LinkModel {
		return this.getParent();
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
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
		if (this.parent) {
			this.parent.removePoint(this);
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

	isLocked() {
		return super.isLocked() || this.getParent().isLocked();
	}
}
