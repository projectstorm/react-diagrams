import { BaseModel, BaseModelListener } from "./BaseModel";
import { PortModel } from "./PortModel";
import * as _ from "lodash";
import { DiagramEngine } from "../DiagramEngine";
import { DiagramModel } from "./DiagramModel";

export class NodeModel extends BaseModel<DiagramModel, BaseModelListener> {
	x: number;
	y: number;
	extras: any;
	ports: { [s: string]: PortModel };

	// calculated post rendering so routing can be done correctly
	width: number;
	height: number;

	constructor(nodeType: string = "default", id?: string) {
		super(nodeType, id);
		this.x = 0;
		this.y = 0;
		this.extras = {};
		this.ports = {};
	}

	setPosition(x, y) {
		//store position
		let oldX = this.x;
		let oldY = this.y;
		_.forEach(this.ports, port => {
			_.forEach(port.getLinks(), link => {
				let point = link.getPointForPort(port);
				point.x = point.x + x - oldX;
				point.y = point.y + y - oldY;
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
		this.x = ob.x;
		this.y = ob.y;
		this.extras = ob.extras;

		//deserialize ports
		_.forEach(ob.ports, (port: any) => {
			let portOb = engine.getPortFactory(port.type).getNewInstance();
			portOb.deSerialize(port, engine);
			this.addPort(portOb);
		});
	}

	serialize() {
		return _.merge(super.serialize(), {
			x: this.x,
			y: this.y,
			extras: this.extras,
			ports: _.map(this.ports, port => {
				return port.serialize();
			})
		});
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

	getPortFromID(id): PortModel | null {
		for (var i in this.ports) {
			if (this.ports[i].id === id) {
				return this.ports[i];
			}
		}
		return null;
	}

	getPort(name: string): PortModel | null {
		return this.ports[name];
	}

	getPorts(): { [s: string]: PortModel } {
		return this.ports;
	}

	removePort(port: PortModel) {
		//clear the parent node reference
		if (this.ports[port.name]) {
			this.ports[port.name].setParent(null);
			delete this.ports[port.name];
		}
	}

	addPort<T extends PortModel>(port: T): T {
		port.setParent(this);
		this.ports[port.name] = port;
		return port;
	}

	updateDimensions({ width, height }: { width: number; height: number }) {
		this.width = width;
		this.height = height;
	}
}
