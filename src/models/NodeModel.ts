import { PortModel } from "./PortModel";
import * as _ from "lodash";
import { DiagramEngine } from "../DiagramEngine";
import { Rectangle, CanvasElementModel } from "@projectstorm/react-canvas";

export class NodeModel extends CanvasElementModel {
	protected dimensions: Rectangle;
	protected ports: { [s: string]: PortModel };

	constructor(nodeType: string = "default") {
		super(nodeType);
		this.dimensions = new Rectangle(0, 0, 0, 0);
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
		if (this.isSelected()) {
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
		this.dimensions.deserialize(ob.dimensions);

		//deserialize ports
		_.forEach(ob.ports, (port: any) => {
			let portOb = engine.getFactory(port.type).generateModel() as PortModel;
			portOb.deSerialize(port, engine, cache);
			this.addPort(portOb);
		});
	}

	serialize() {
		return _.merge(super.serialize(), {
			dimensions: this.dimensions.serialize(),
			ports: _.map(this.ports, port => {
				return port.serialize();
			})
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
}
