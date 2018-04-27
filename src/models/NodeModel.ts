import { PortModel } from "./PortModel";
import * as _ from "lodash";
import { DiagramEngine } from "../DiagramEngine";
import {Rectangle, CanvasElementModel} from "@projectstorm/react-canvas";

export class NodeModel extends CanvasElementModel {

	dimensions: Rectangle;
	extras: any;
	ports: { [s: string]: PortModel };

	constructor(nodeType: string = "default") {
		super(nodeType);
		this.dimensions = new Rectangle(0,0,0,0);
		this.extras = {};
		this.ports = {};
	}

	setDimensions(dimensions: Rectangle) {
		this.dimensions = dimensions;
	}

	getDimensions(): Rectangle {
		return this.dimensions;
	}

	getSelectedEntities() {
		let entities = [];
		if(this.isSelected()){
			entities.push(this);
		}

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

	deSerialize(ob, engine: DiagramEngine, cache) {
		super.deSerialize(ob, engine, cache);
		this.x = ob.x;
		this.y = ob.y;
		this.extras = ob.extras;

		//deserialize ports
		_.forEach(ob.ports, (port: any) => {
			let portOb = engine.getFactory(port.type).generateModel() as PortModel;
			portOb.deSerialize(port, engine, cache);
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
		_.forEach(this.ports, port => {
			_.forEach(port.getLinks(), link => {
				link.remove();
			});
		});
	}

	getPortFromID(id): PortModel | null {
		for (let i in this.ports) {
			if (this.ports[i].getID() === id) {
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
