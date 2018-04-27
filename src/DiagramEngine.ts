import { BaseEntity, BaseListener } from "./BaseEntity";
import { DiagramModel } from "./models/DiagramModel";
import * as _ from "lodash";
import { NodeModel } from "./models/NodeModel";
import { PointModel } from "./models/PointModel";
import { PortModel } from "./models/PortModel";
import { ROUTING_SCALING_FACTOR } from "./routing/PathFinding";
import { Toolkit } from "./Toolkit";
import { CanvasEngine } from "@projectstorm/react-canvas";
/**
 * @author Dylan Vorster
 */
export interface DiagramEngineListener extends BaseListener {
	portFactoriesUpdated?(): void;

	nodeFactoriesUpdated?(): void;

	linkFactoriesUpdated?(): void;

	labelFactoriesUpdated?(): void;

	repaintCanvas?(): void;
}

/**
 * Passed as a parameter to the DiagramWidget
 */
export class DiagramEngine extends CanvasEngine {
	paintableWidgets: {};
	linksThatHaveInitiallyRendered: {};
	nodesRendered: boolean;
	maxNumberPointsPerLink: number;
	smartRouting: boolean;
	model: DiagramModel;

	// calculated only when smart routing is active
	canvasMatrix: number[][] = [];
	routingMatrix: number[][] = [];
	// used when at least one element has negative coordinates
	hAdjustmentFactor: number = 0;
	vAdjustmentFactor: number = 0;

	constructor() {
		super();
		this.paintableWidgets = null;
		this.linksThatHaveInitiallyRendered = {};
	}

	installDefaults() {
		super.installDefaults();
	}

	clearRepaintEntities() {
		this.paintableWidgets = null;
	}

	recalculatePortsVisually() {
		this.nodesRendered = false;
		this.linksThatHaveInitiallyRendered = {};
	}

	getMaxNumberPointsPerLink(): number {
		return this.maxNumberPointsPerLink;
	}

	setMaxNumberPointsPerLink(max: number) {
		this.maxNumberPointsPerLink = max;
	}

	isSmartRoutingEnabled() {
		return !!this.smartRouting;
	}

	setSmartRoutingStatus(status: boolean) {
		this.smartRouting = status;
	}
}
