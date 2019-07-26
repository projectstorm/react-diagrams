import { BaseModelListener } from '../core-models/BaseModel';
import * as _ from 'lodash';
import { DiagramEngine } from '../DiagramEngine';
import { BaseEntityEvent } from '../core-models/BaseEntity';
import { BasePositionModel, BasePositionModelGenerics } from '../core-models/BasePositionModel';
import { DiagramModel } from './DiagramModel';
import { PortModel } from './PortModel';
import { LinkModel } from './LinkModel';
import { Point } from '@projectstorm/react-diagrams-geometry';

export interface NodeModelListener extends BaseModelListener {
	positionChanged?(event: BaseEntityEvent<NodeModel>): void;
}

export interface NodeModelGenerics extends BasePositionModelGenerics {
	LISTENER: NodeModelListener;
	PARENT: DiagramModel;
	PORT: PortModel;
}

export class NodeModel<G extends NodeModelGenerics = NodeModelGenerics> extends BasePositionModel<G> {
	ports: { [s: string]: G['PORT'] };

	// calculated post rendering so routing can be done correctly
	width: number;
	height: number;

	constructor(options: G['OPTIONS']) {
		super(options);
		this.ports = {};
		this.width = 0;
		this.height = 0;
	}

	setPosition(point: Point);
	setPosition(x: number, y: number);
	setPosition(x, y?) {
		let old = this.position;
		super.setPosition(x, y);

		// also update the port co-ordinates (for make glorious speed)
		_.forEach(this.ports, port => {
			_.forEach(port.getLinks(), link => {
				let point = link.getPointForPort(port);
				point.setPosition(point.getX() + x - old.x, point.getY() + y - old.y);
			});
		});
	}

	getSelectedEntities() {
		let entities = super.getSelectedEntities();

		// add the points of each link that are selected here
		if (this.isSelected()) {
			_.forEach(this.ports, port => {
				entities = entities.concat(
					_.map(port.getLinks(), link => {
						return link.getPointForPort(port);
					})
				);
			});
		}
		return entities;
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);

		//deserialize ports
		_.forEach(ob.ports, (port: any) => {
			let portOb = engine.getFactoryForPort(port.type).generateModel({});
			portOb.deSerialize(port, engine);
			this.addPort(portOb);
		});
	}

	serialize(): any {
		return {
			...super.serialize(),
			ports: _.map(this.ports, port => {
				return port.serialize();
			})
		};
	}

	doClone(lookupTable = {}, clone) {
		// also clone the ports
		clone.ports = {};
		_.forEach(this.ports, port => {
			clone.addPort(port.clone(lookupTable));
		});
	}

	remove() {
		super.remove();
		_.forEach(this.ports, port => {
			_.forEach(port.getLinks(), link => {
				link.remove();
			});
		});
	}

	getPortFromID(id): G['PORT'] | null {
		for (var i in this.ports) {
			if (this.ports[i].getID() === id) {
				return this.ports[i];
			}
		}
		return null;
	}

	getLink(id: string): LinkModel {
		for (let portID in this.ports) {
			const links = this.ports[portID].getLinks();
			if (links[id]) {
				return links[id];
			}
		}
	}

	getPort(name: string): G['PORT'] | null {
		return this.ports[name];
	}

	getPorts(): { [s: string]: G['PORT'] } {
		return this.ports;
	}

	removePort(port: G['PORT']) {
		//clear the parent node reference
		if (this.ports[port.getName()]) {
			this.ports[port.getName()].setParent(null);
			delete this.ports[port.getName()];
		}
	}

	addPort<T extends G['PORT']>(port: T): T {
		port.setParent(this);
		this.ports[port.getName()] = port;
		return port;
	}

	updateDimensions({ width, height }: { width: number; height: number }) {
		this.width = width;
		this.height = height;
	}
}
