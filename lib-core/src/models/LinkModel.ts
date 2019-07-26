import { BaseModel, BaseModelGenerics, BaseModelListener } from '../core-models/BaseModel';
import { PortModel } from './PortModel';
import { PointModel } from './PointModel';
import * as _ from 'lodash';
import { LabelModel } from './LabelModel';
import { DiagramEngine } from '../DiagramEngine';
import { BaseEntityEvent } from '../core-models/BaseEntity';
import { DiagramModel } from './DiagramModel';

export interface LinkModelListener extends BaseModelListener {
	sourcePortChanged?(event: BaseEntityEvent<LinkModel> & { port: null | PortModel }): void;

	targetPortChanged?(event: BaseEntityEvent<LinkModel> & { port: null | PortModel }): void;
}

export interface LinkModelGenerics extends BaseModelGenerics {
	LISTENER: LinkModelListener;
	PARENT: DiagramModel;
}

export class LinkModel<G extends LinkModelGenerics = LinkModelGenerics> extends BaseModel<G> {
	protected sourcePort: PortModel | null;
	protected targetPort: PortModel | null;

	protected labels: LabelModel[];
	protected points: PointModel[];

	constructor(options: G['OPTIONS']) {
		super(options);
		this.points = [
			new PointModel({
				link: this,
				points: { x: 0, y: 0 }
			}),
			new PointModel({
				link: this,
				points: { x: 0, y: 0 }
			})
		];
		this.sourcePort = null;
		this.targetPort = null;
		this.labels = [];
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.points = _.map(ob.points || [], (point: { x; y }) => {
			var p = new PointModel({
				link: this,
				points: { x: point.x, y: point.y }
			});
			p.deSerialize(point, engine);
			return p;
		});

		//deserialize labels
		_.forEach(ob.labels || [], (label: any) => {
			let labelOb = engine.getFactoryForLabel(label.type).generateModel({});
			labelOb.deSerialize(label, engine);
			this.addLabel(labelOb);
		});

		if (ob.target) {
			this.setTargetPort(
				this.getParent()
					.getNode(ob.target)
					.getPortFromID(ob.targetPort)
			);
		}

		if (ob.source) {
			this.setSourcePort(
				this.getParent()
					.getNode(ob.source)
					.getPortFromID(ob.sourcePort)
			);
		}
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

	point(x: number, y: number): PointModel {
		return this.addPoint(this.generatePoint(x, y));
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
			points: { x: x, y: y }
		});
	}
}
