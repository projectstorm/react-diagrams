import * as SRD from "../../src/main";
import { DiamonNodeWidget } from "./DiamondNodeWidget";
import { DiamondNodeModel } from "./DiamondNodeModel";
import * as React from "react";

export class DiamondNodeFactory extends SRD.NodeFactory {
	constructor() {
		super("diamond");
	}

	generateReactWidget(diagramEngine: SRD.DiagramEngine, node: SRD.NodeModel): JSX.Element {
		return <DiamonNodeWidget node={node} />;
	}

	getNewInstance() {
		return new DiamondNodeModel();
	}
}
