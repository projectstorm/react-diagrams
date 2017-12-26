import { BaseModel, BaseModelListener } from "./BaseModel";
import { PortModel } from "./PortModel";
import { PointModel } from "./PointModel";
import * as _ from "lodash";
import { BaseEvent } from "../BaseEntity";

export interface LinkModelListener extends BaseModelListener {
	sourcePortChanged?(event: BaseEvent<LinkModel> & { port: null | PortModel }): void;

	targetPortChanged?(event: BaseEvent<LinkModel> & { port: null | PortModel }): void;
}

export class LinkModel extends BaseModel<LinkModelListener> {
	linkType: string;
	sourcePort: PortModel | null;
	targetPort: PortModel | null;
	points: PointModel[];
	extras: {};

	constructor() {
		super();
		this.linkType = "default";
		this.points = [new PointModel(this, { x: 0, y: 0 }), new PointModel(this, { x: 0, y: 0 })];
		this.extras = {};
		this.sourcePort = null;
		this.targetPort = null;
	}

	deSerialize(ob) {
		super.deSerialize(ob);
		this.linkType = ob.type;
		this.extras = ob.extras;
		this.points = _.map(ob.points, (point: { x; y }) => {
			var p = new PointModel(this, { x: point.x, y: point.y });
			p.deSerialize(point);
			return p;
		});
	}

	serialize() {
		return _.merge(super.serialize(), {
			type: this.linkType,
			source: this.sourcePort ? this.sourcePort.getParent().id : null,
			sourcePort: this.sourcePort ? this.sourcePort.id : null,
			target: this.targetPort ? this.targetPort.getParent().id : null,
			targetPort: this.targetPort ? this.targetPort.id : null,
			points: _.map(this.points, point => {
				return point.serialize();
			}),
			extras: this.extras
		});
	}

	clone(lookupTable) {
		if(((lookupTable||{})[this.class]||{}).hasOwnProperty(this.id)) return lookupTable[this.class][this.id];
		let clone = super.clone(lookupTable);
		clone.setPoints(_.map(clone.getPoints(),(point:PointModel) => {
			let newPoint = point.clone(lookupTable);
			newPoint.link = clone;
			return newPoint;
		}));
		if(this.sourcePort) clone.setSourcePort(this.sourcePort.clone(lookupTable));
		if(this.targetPort) clone.setTargetPort(this.targetPort.clone(lookupTable));
		return clone
	}

	remove() {
		if (this.sourcePort) {
			this.sourcePort.removeLink(this);
		}
		if (this.targetPort) {
			this.targetPort.removeLink(this);
		}
		super.remove();
	}

	isLastPoint(point: PointModel) {
		var index = this.getPointIndex(point);
		return index === this.points.length - 1;
	}

	getPointIndex(point: PointModel) {
		return this.points.indexOf(point);
	}

	getPointModel(id: string): PointModel | null {
		for (var i = 0; i < this.points.length; i++) {
			if (this.points[i].id === id) {
				return this.points[i];
			}
		}
		return null;
	}

	getPortForPoint(point: PointModel): PortModel {
		if (this.sourcePort !== null && this.getFirstPoint().getID() === point.getID()) {
			return this.sourcePort;
		}
		if (this.targetPort !== null && this.getLastPoint().getID() === point.getID()) {
			return this.targetPort;
		}
		return null;
	}

	getPointForPort(port: PortModel): PointModel {
		if (this.sourcePort !== null && this.sourcePort.getID() === port.getID()) {
			return this.getFirstPoint();
		}
		if (this.targetPort !== null && this.targetPort.getID() === port.getID()) {
			return this.getLastPoint();
		}
		return null;
	}

	getFirstPoint(): PointModel {
		return this.points[0];
	}

	getLastPoint(): PointModel {
		return this.points[this.points.length - 1];
	}

	setSourcePort(port: PortModel) {
		port.addLink(this);
		this.sourcePort = port;
		this.iterateListeners((listener: LinkModelListener, event) => {
			listener.sourcePortChanged && listener.sourcePortChanged({ ...event, port: port });
		});
	}

	getSourcePort(): PortModel {
		return this.sourcePort;
	}

	getTargetPort(): PortModel {
		return this.targetPort;
	}

	setTargetPort(port: PortModel) {
		port.addLink(this);
		this.targetPort = port;
		this.iterateListeners((listener: LinkModelListener, event) => {
			listener.targetPortChanged && listener.targetPortChanged({ ...event, port: port });
		});
	}

	getPoints(): PointModel[] {
		return this.points;
	}

	setPoints(points: PointModel[]) {
		this.points = points;
	}

	removePoint(pointModel: PointModel) {
		this.points.splice(this.getPointIndex(pointModel), 1);
	}

	removePointsBefore(pointModel: PointModel) {
		this.points.splice(0,this.getPointIndex(pointModel))
	}

	removePointsAfter(pointModel: PointModel) {

		this.points.splice(this.getPointIndex(pointModel)+1)
	}

	addPoint(pointModel: PointModel, index = 1) {
		this.points.splice(index, 0, pointModel);
	}

	getType(): string {
		return this.linkType;
	}
}
