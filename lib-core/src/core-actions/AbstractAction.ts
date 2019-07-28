import { DiagramEngine } from '../DiagramEngine';
import { DiagramModel } from '../models/DiagramModel';

export class AbstractAction {
	engine: DiagramEngine;
	model: DiagramModel;

	constructor(engine: DiagramEngine) {
		this.engine = engine;
		this.model = engine.getDiagramModel();
	}
}
