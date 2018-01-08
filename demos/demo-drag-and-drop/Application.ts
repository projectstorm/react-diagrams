import * as SRD from "../../src/main";
/**
 * @author Dylan Vorster
 */
export class Application {
	protected activeModel: SRD.DiagramModel;
	protected diagramEngine: SRD.DiagramEngine;

	constructor() {
		this.diagramEngine = new SRD.DiagramEngine();
		this.diagramEngine.installDefaultFactories();

		this.newModel();
	}

	public newModel() {
		this.activeModel = new SRD.DiagramModel();
		this.diagramEngine.setDiagramModel(this.activeModel);

		var node1 = new SRD.DefaultNodeModel("Node 1", "rgb(0,192,255)");
		var port1 = node1.addPort(new SRD.DefaultPortModel(false, "out-1", "Out"));
		node1.x = 100;
		node1.y = 100;

		var node2 = new SRD.DefaultNodeModel("Node 2", "rgb(192,255,0)");
		var port2 = node2.addPort(new SRD.DefaultPortModel(true, "in-1", "IN"));
		node2.x = 400;
		node2.y = 100;

		var link1 = new SRD.LinkModel();
		link1.setSourcePort(port1);
		link1.setTargetPort(port2);

		this.activeModel.addNode(node1);
		this.activeModel.addNode(node2);
		this.activeModel.addLink(link1);
	}

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.diagramEngine;
	}
}
