import { BaseModel, BaseModelListener } from "./BaseModel";
import { PortModel } from "./PortModel";
import * as _ from "lodash";

export class NodeModel extends BaseModel<BaseModelListener> {
	nodeType: string;
	x: number;
	y: number;
	extras: {};
	ports: { [s: string]: PortModel };

	constructor(nodeType: string = "default", id?: string) {
		super(id);
		this.nodeType = nodeType;
		this.x = 0;
		this.y = 0;
		this.extras = {};
		this.ports = {};
	}

	setPosition(x, y) {
		//store position
		let oldX = this.x;
		let oldY = this.y;
		for (let port in this.ports) {
			_.forEach(this.ports[port].getLinks(), link => {
				let point = link.getPointForPort(this.ports[port]);
				point.x = point.x + x - oldX;
				point.y = point.y + y - oldY;
			});
		}

		this.x = x;
		this.y = y;
	}

	getSelectedEntities() {
		let entities = super.getSelectedEntities();

		// add the points of each link that are selected here
		if (this.isSelected()) {
			for (let portName in this.ports) {
				entities = entities.concat(
					_.map(this.ports[portName].getLinks(), link => {
						return link.getPointForPort(this.ports[portName]);
					})
				);
			}
		}
		return entities;
	}

	deSerialize(ob) {
		super.deSerialize(ob);
		this.nodeType = ob.type;
		this.x = ob.x;
		this.y = ob.y;
		this.extras = ob.extras;
	}

	serialize() {
		return _.merge(super.serialize(), {
			type: this.nodeType,
			x: this.x,
			y: this.y,
			extras: this.extras,
			ports: _.map(this.ports, port => {
				return port.serialize();
			})
		});
	}

	doClone(lookupTable = {}, clone){
		// also clone the ports
		clone.ports = {};
		_.values(this.ports).forEach((port) => {
			clone.addPort(port.clone(lookupTable));
		});
	}

	remove() {
		super.remove();
		for (var i in this.ports) {
			_.forEach(this.ports[i].getLinks(), link => {
				link.remove();
			});
		}
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
			this.ports[port.name].setParentNode(null);
			delete this.ports[port.name];
		}
	}

	addPort(port: PortModel): PortModel {
		port.setParentNode(this);
		this.ports[port.name] = port;
		return port;
	}

	getType(): string {
		return this.nodeType;
	}
}
