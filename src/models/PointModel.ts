import { LinkModel } from "./LinkModel";
import * as _ from "lodash";
import {
	Point,
	CanvasElementModel,
	CanvasElementModelListener,
	Rectangle,
	DeserializeEvent
} from "@projectstorm/react-canvas";

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

	isConnectedToPort(): boolean {
		return this.link.getPortForPoint(this) !== null;
	}

	setLink(link: LinkModel) {
		this.link = link;
	}

	getLink(): LinkModel {
		return this.link;
	}

	deSerialize(event: DeserializeEvent) {
		super.deSerialize(event);
		this.point = new Point(event.data["x"], event.data["y"]);
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
