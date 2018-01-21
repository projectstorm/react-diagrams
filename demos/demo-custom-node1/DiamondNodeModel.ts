import * as SRD from "../../src/main";
import { DiamondPortModel } from "./DiamondPortModel";

export class DiamondNodeModel extends SRD.NodeModel {

	constructor() {
		super("diamond");
		this.addPort(new DiamondPortModel("top"));
		this.addPort(new DiamondPortModel("left"));
		this.addPort(new DiamondPortModel("bottom"));
		this.addPort(new DiamondPortModel("right"));
	}
}
