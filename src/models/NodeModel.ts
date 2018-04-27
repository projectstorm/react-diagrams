import { PortModel } from "./PortModel";
import * as _ from "lodash";
import { DiagramEngine } from "../DiagramEngine";
import { Rectangle, CanvasElementModel, GraphModel } from "@projectstorm/react-canvas";

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
			ports: this.ports.serialize()
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
		return this.ports.getEntities()[name];
	}

	getPorts(): { [s: string]: PortModel } {
		return this.ports.getEntities();
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
