import { LinkModel } from "./LinkModel";
import * as _ from "lodash";
import { DiagramEngine } from "../DiagramEngine";
import { Point, CanvasElementModel, CanvasElementModelListener, Rectangle } from "@projectstorm/react-canvas";

export class PointModel extends CanvasElementModel<CanvasElementModelListener> {
	protected point: Point;
	protected link: LinkModel;

	constructor(link: LinkModel) {
		super("point");
		this.link = link;
	}

	setDimensions(dimensions: Rectangle) {
		this.point = dimensions.getTopLeft();
	}

	getDimensions(): Rectangle {
		return new Rectangle(this.point, 10, 10);
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

	setLink(link: LinkModel) {
		this.link = link;
	}

	getLink(): LinkModel {
		return this.link;
	}

	deSerialize(ob, engine: DiagramEngine, cache) {
		super.deSerialize(ob, engine, cache);
		this.point = new Point(ob["x"], ob["y"]);
	}

	serialize() {
		return _.merge(super.serialize(), {
			x: this.point.x,
			y: this.point.y
		});
	}

	remove() {
		//clear references
		if (this.link) {
			this.link.removePoint(this);
		}
	}

	getPoint(): Point {
		return this.point;
	}
}
