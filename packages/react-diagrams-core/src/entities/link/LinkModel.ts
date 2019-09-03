import { PortModel } from '../port/PortModel';
import { PointModel } from './PointModel';
import * as _ from 'lodash';
import { LabelModel } from '../label/LabelModel';
import { DiagramEngine } from '../../DiagramEngine';
import { DiagramModel } from '../../models/DiagramModel';
import { Point, Polygon, Rectangle } from '@projectstorm/geometry';
import {
	BaseEntityEvent,
	BaseModel,
	BaseModelGenerics,
	BaseModelListener,
	DeserializeEvent,
	ModelGeometryInterface
} from '@projectstorm/react-canvas-core';

export interface LinkModelListener extends BaseModelListener {
	sourcePortChanged?(event: BaseEntityEvent<LinkModel> & { port: null | PortModel }): void;

	targetPortChanged?(event: BaseEntityEvent<LinkModel> & { port: null | PortModel }): void;
}

export interface LinkModelGenerics extends BaseModelGenerics {
	LISTENER: LinkModelListener;
	PARENT: DiagramModel;
}

export class LinkModel<G extends LinkModelGenerics = LinkModelGenerics> extends BaseModel<G>
	implements ModelGeometryInterface {
	protected sourcePort: PortModel | null;
	protected targetPort: PortModel | null;

	protected labels: LabelModel[];
	protected points: PointModel[];

	protected renderedPaths: SVGPathElement[];

	constructor(options: G['OPTIONS']) {
		super(options);
		this.points = [
			new PointModel({
				link: this
			}),
			new PointModel({
				link: this
			})
		];
		this.sourcePort = null;
		this.targetPort = null;
		this.renderedPaths = [];
		this.labels = [];
	}

	getBoundingBox(): Rectangle {
		return Polygon.boundingBoxFromPoints(
			_.map(this.points, (point: PointModel) => {
				return point.getPosition();
			})
		);
	}

	getSelectionEntities(): Array<BaseModel> {
		if (this.getTargetPort() && this.getSourcePort()) {
			return super.getSelectionEntities().concat(_.slice(this.points, 1, this.points.length - 1));
		}
		// allow selection of the first point
		if (!this.getSourcePort()) {
			return super.getSelectionEntities().concat(_.slice(this.points, 0, this.points.length - 1));
		}
		// allow selection of the last point
		if (!this.getTargetPort()) {
			return super.getSelectionEntities().concat(_.slice(this.points, 1, this.points.length));
		}
		return super.getSelectionEntities().concat(this.points);
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.points = _.map(event.data.points || [], point => {
			var p = new PointModel({
				link: this,
				position: new Point(point.x, point.y)
			});
			p.deserialize({
				...event,
				data: point
			});
			return p;
		});

		//deserialize labels
		_.forEach(event.data.labels || [], (label: any) => {
			let labelOb = (event.engine as DiagramEngine).getFactoryForLabel(label.type).generateModel({});
			labelOb.deserialize({
				...event,
				data: label
			});
			this.addLabel(labelOb);
		});

		// these happen async, so we use the promises for these (they need to be done like this without the async keyword
		// because we need the deserailize method to finish for other methods while this happen
		if (event.data.target) {
			event.getModel(event.data.targetPort).then((model: PortModel) => {
				this.setTargetPort(model);
			});
		}
		if (event.data.source) {
			event.getModel(event.data.sourcePort).then((model: PortModel) => {
				this.setSourcePort(model);
			});
		}
	}

	getRenderedPath(): SVGPathElement[] {
		return this.renderedPaths;
	}

	setRenderedPaths(paths: SVGPathElement[]) {
		this.renderedPaths = paths;
	}

	serialize() {
		return {
			...super.serialize(),
			source: this.sourcePort ? this.sourcePort.getParent().getID() : null,
			sourcePort: this.sourcePort ? this.sourcePort.getID() : null,
			target: this.targetPort ? this.targetPort.getParent().getID() : null,
			targetPort: this.targetPort ? this.targetPort.getID() : null,
			points: _.map(this.points, point => {
				return point.serialize();
			}),
			labels: _.map(this.labels, label => {
				return label.serialize();
			})
		};
	}

	doClone(lookupTable = {}, clone) {
		clone.setPoints(
			_.map(this.getPoints(), (point: PointModel) => {
				return point.clone(lookupTable);
			})
		);
		if (this.sourcePort) {
			clone.setSourcePort(this.sourcePort.clone(lookupTable));
		}
		if (this.targetPort) {
			clone.setTargetPort(this.targetPort.clone(lookupTable));
		}
	}

	clearPort(port: PortModel) {
		if (this.sourcePort === port) {
			this.setSourcePort(null);
		} else if (this.targetPort === port) {
			this.setTargetPort(null);
		}
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
			if (this.points[i].getID() === id) {
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
		if (port !== null) {
			port.addLink(this);
		}
		if (this.sourcePort !== null) {
			this.sourcePort.removeLink(this);
		}
		this.sourcePort = port;
		this.fireEvent({ port }, 'sourcePortChanged');
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
		this.fireEvent({ port }, 'targetPortChanged');
	}

	point(x: number, y: number, index: number = 1): PointModel {
		return this.addPoint(this.generatePoint(x, y), index);
	}

	addLabel(label: LabelModel) {
		label.setParent(this);
		this.labels.push(label);
	}

	getPoints(): PointModel[] {
		return this.points;
	}

	getLabels() {
		return this.labels;
	}

	setPoints(points: PointModel[]) {
		_.forEach(points, point => {
			point.setParent(this);
		});
		this.points = points;
	}

	removePoint(pointModel: PointModel) {
		this.points.splice(this.getPointIndex(pointModel), 1);
	}

	removePointsBefore(pointModel: PointModel) {
		this.points.splice(0, this.getPointIndex(pointModel));
	}

	removePointsAfter(pointModel: PointModel) {
		this.points.splice(this.getPointIndex(pointModel) + 1);
	}

	removeMiddlePoints() {
		if (this.points.length > 2) {
			this.points.splice(0, this.points.length - 2);
		}
	}

	addPoint<P extends PointModel>(pointModel: P, index = 1): P {
		pointModel.setParent(this);
		this.points.splice(index, 0, pointModel);
		return pointModel;
	}

	generatePoint(x: number = 0, y: number = 0): PointModel {
		return new PointModel({
			link: this,
			position: new Point(x, y)
		});
	}
}
