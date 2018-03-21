import { DiagramEngine } from "../DiagramEngine";

export class BaseAction {
	ms: number;

	constructor() {
		this.ms = new Date().getTime();
	}

	actionWillFire(engine: DiagramEngine) {}

	actionDidFire(engine: DiagramEngine) {}
}
