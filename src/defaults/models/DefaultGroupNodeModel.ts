import { NodeModel } from "../../models/NodeModel";
import { DiagramEngine } from "../../DiagramEngine";
import { RenderAction } from "../../actions/RenderAction";
import { BaseAction } from "../../actions/BaseAction";
import * as _ from "lodash";
import { BaseModel } from "../../models/BaseModel";

export class DefaultGroupNodeModel extends NodeModel {
	nodes: NodeModel[];
	title: string;

	constructor(title: string) {
		super("default-group-node");
		this.nodes = [];
		this.title = title;
	}

	recollectChildNodes(engine: DiagramEngine) {
		let diagramModel = engine.getDiagramModel();
		this.nodes = [];

		_.forEach(diagramModel.getNodes(), node => {
			if (
				node.id !== this.id &&
				node.x > this.x &&
				node.x < this.x + this.width &&
				node.y > this.y &&
				node.y < this.y + this.height
			) {
				this.nodes.push(node);
			}
		});
	}

	getSelectedEntities(): BaseModel[] {
		let entities = super.getSelectedEntities();

		_.forEach(this.nodes, node => {
			entities.push(node);
			_.forEach(node.ports, port => {
				entities = entities.concat(
					_.map(port.getLinks(), link => {
						return link.getPointForPort(port);
					})
				);
			});
		});

		return entities;
	}

	canvasActionFired(action: BaseAction, diagramEngine: DiagramEngine) {
		super.canvasActionFired(action, diagramEngine);
		if (action instanceof RenderAction) {
			this.recollectChildNodes(diagramEngine);
		}
	}
}
