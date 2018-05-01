import { PortModel } from "./PortModel";
import { PointModel } from "./PointModel";
import * as _ from "lodash";
import { LabelModel } from "./LabelModel";
import { DiagramEngine } from "../DiagramEngine";
import {
	BaseEvent,
	GraphModel,
	GraphModelOrdered,
	CanvasElementModel,
	CanvasElementModelListener,
	Rectangle
} from "@projectstorm/react-canvas";
import {DiagramModel} from "storm-react-diagrams";

export interface LinkModelListener<T extends LinkModel = any> extends CanvasElementModelListener<T> {
	sourcePortChanged?(event: BaseEvent<T> & { port: null | PortModel }): void;

	targetPortChanged?(event: BaseEvent<T> & { port: null | PortModel }): void;
}

export class LinkModel<T extends LinkModelListener = LinkModelListener> extends CanvasElementModel<T> {
	protected sourcePort: PortModel | null;
	protected targetPort: PortModel | null;
	protected labels: GraphModel<LabelModel, LinkModel>;
	protected points: GraphModelOrdered<PointModel, LinkModel>;

	constructor(linkType: string = "default") {
		super(linkType);
		this.points = new GraphModelOrdered();
		this.labels = new GraphModel();
		this.points.setParentDelegate(this);
		this.labels.setParentDelegate(this);
		this.sourcePort = null;
		this.targetPort = null;
	}

	setDimensions(dimensions: Rectangle) {
		throw new Error("Method not implemented.");
	}

	getDimensions(): Rectangle {
		throw new Error("Method not implemented.");
	}

	deSerialize(ob, engine: DiagramEngine, cache) {
		super.deSerialize(ob, engine, cache);
		this.points.deSerialize(ob["points"], engine, cache);
		this.labels.deSerialize(ob["labels"], engine, cache);
		if (ob.target) {
			this.setTargetPort(cache[ob.targetPort]);
		}

		if (ob.source) {
			this.setSourcePort(cache[ob.sourcePort]);
		}
	}

	serialize() {
		return _.merge(super.serialize(), {
			source: this.sourcePort ? this.sourcePort.getParent().getID() : null,
			sourcePort: this.sourcePort ? this.sourcePort.getID() : null,
			target: this.targetPort ? this.targetPort.getParent().getID() : null,
			targetPort: this.targetPort ? this.targetPort.getID() : null,
			points: this.points.serialize(),
			labels: this.labels.serialize()
		});
	}

	remove() {
		if (this.sourcePort) {
			this.sourcePort.removeLink(this);
		}
		if (this.targetPort) {
			this.targetPort.removeLink(this);
		}
	}

	isLastPoint(point: PointModel) {
		var index = this.getPointIndex(point);
		return index === this.points.count() - 1;
	}

	getPointIndex(point: PointModel) {
		return _.values(this.points.getEntities()).indexOf(point);
	}

	getPointModel(id: string): PointModel | null {
		return this.points.getEntities()[id];
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
		return _.values(this.points.getEntities())[0];
	}

	getLastPoint(): PointModel {
		return _.values(this.points.getEntities())[this.points.count() - 1];
	}

	setSourcePort(port: PortModel) {
		if (port !== null) {
			port.addLink(this);
		}
		if (this.sourcePort !== null) {
			this.sourcePort.removeLink(this);
		}
		this.sourcePort = port;
		this.iterateListeners((listener: T, event) => {
			if (listener.sourcePortChanged) {
				listener.sourcePortChanged({ ...event, port: port });
			}
		});
	}

	getSourcePort(): PortModel {
		return this.sourcePort;
	}

	getTargetPort(): PortModel {
		return this.targetPort;
	}

	setTargetPort(port: PortModel) {
		if (port !== null) {
			port.addLink(this);
		}
		if (this.targetPort !== null) {
			this.targetPort.removeLink(this);
		}
		this.targetPort = port;
		this.iterateListeners((listener: T, event) => {
			if (listener.targetPortChanged) {
				listener.targetPortChanged({ ...event, port: port });
			}
		});
	}

	point(x: number, y: number): PointModel {
		return this.addPoint(this.generatePoint(x, y));
	}

	addLabel(label: LabelModel) {
		this.labels.addEntity(label);
	}

	getPoints(): PointModel[] {
		return this.points.getArray();
	}

	setPoints(points: PointModel[]) {
		_.forEach(points, point => {
			point.setLink(this);
		});
		this.points.addEntities(points);
	}

	removePoint(pointModel: PointModel) {
		this.points.removeEntity(pointModel);
	}

	addPoint<P extends PointModel>(pointModel: P, index = 1): P {
		pointModel.setLink(this);
		this.points.splice(index, 0, pointModel);
		return pointModel;
	}

	generatePoint(x: number, y: number): PointModel {
		let point = new PointModel(this);
		point.getPoint().x = x;
		point.getPoint().y = y;
		return point;
	}
}
