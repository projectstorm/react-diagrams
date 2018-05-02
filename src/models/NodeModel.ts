import { PortModel } from "./PortModel";
import * as _ from "lodash";
import { Rectangle, CanvasElementModel, GraphModel, DeserializeEvent } from "@projectstorm/react-canvas";

export class NodeModel<T extends PortModel = PortModel> extends CanvasElementModel {
	protected dimensions: Rectangle;
	protected ports: GraphModel<null, T>;

	constructor(nodeType: string = "default") {
		super(nodeType);
		this.dimensions = new Rectangle(0, 0, 0, 0);
		this.ports = new GraphModel("ports");
	}

	setDimensions(dimensions: Rectangle) {
		this.dimensions = dimensions;
	}

	getDimensions(): Rectangle {
		return this.dimensions;
	}

	setPosition(x:number, y:number){
		this.dimensions.updateDimensions(x,y, this.dimensions.getWidth(), this.dimensions.getHeight());
	}

	deSerialize(event: DeserializeEvent) {
		super.deSerialize(event);
		this.dimensions.deserialize(event.data.dimensions);

		//deserialize ports
		let ports = event.subset("ports");
		_.forEach(ports.data, (port: any, index) => {
			let portOb = event.engine.getFactory(port.type).generateModel() as PortModel;
			portOb.deSerialize(ports.subset(index));
			this.addPort(portOb);
		});
	}

	serialize() {
		return _.merge(super.serialize(), {
			dimensions: this.dimensions.serialize(),
			ports: this.ports.serialize()
		});
	}

	getPortFromID(id): T | null {
		for (let i in this.ports) {
			if (this.ports[i].getID() === id) {
				return this.ports[i];
			}
		}
		return null;
	}

	getPort(name: string): T | null {
		return this.ports.getEntities()[name];
	}

	getPorts(): { [s: string]: T } {
		return this.ports.getEntities();
	}

	removePort(port: T) {
		//clear the parent node reference
		if (this.ports[port.name]) {
			this.ports[port.name].setParent(null);
			delete this.ports[port.name];
		}
	}

	addPort<T extends T>(port: T): T {
		port.setParent(this);
		this.ports[port.name] = port;
		return port;
	}
}
