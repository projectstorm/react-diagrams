import { BaseModelListener } from '../core-models/BaseModel';
import * as _ from 'lodash';
import { DiagramEngine } from '../DiagramEngine';
import { BaseEntityEvent } from '../core-models/BaseEntity';
import { BasePositionModel, BasePositionModelGenerics } from '../core-models/BasePositionModel';
import { DiagramModel } from './DiagramModel';
import { PortModel } from './PortModel';
import { LinkModel } from "./LinkModel";

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
		this.x = 0;
		this.y = 0;
		this.ports = {};
	}

	setPosition(x, y) {
		//store position
		let oldX = this.x;
		let oldY = this.y;
		_.forEach(this.ports, port => {
			_.forEach(port.getLinks(), link => {
				let point = link.getPointForPort(port);
				point.updateLocation({
					x: point.getX() + x - oldX,
					y: point.getY() + y - oldY
				});
			});
		});
		this.x = x;
		this.y = y;
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

	getLink(id: string): LinkModel{
		for(let portID in this.ports){
			const links = this.ports[portID].getLinks();
			if(links[id]){
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
