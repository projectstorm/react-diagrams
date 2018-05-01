import { DiagramModel } from "./models/DiagramModel";
import { CanvasEngine } from "@projectstorm/react-canvas";
import { DefaultLabelFactory, DefaultLinkFactory, DefaultNodeFactory, DefaultPortFactory } from "storm-react-diagrams";

export class DiagramEngine extends CanvasEngine<DiagramModel> {
	paintableWidgets: {};
	linksThatHaveInitiallyRendered: {};
	maxNumberPointsPerLink: number;
	smartRouting: boolean;

	constructor() {
		super();
		this.paintableWidgets = null;
		this.linksThatHaveInitiallyRendered = {};
		this.smartRouting = false;
	}

	installDefaults() {
		super.installDefaults();
		this.registerElementFactory(new DefaultLabelFactory());
		this.registerElementFactory(new DefaultLinkFactory());
		this.registerElementFactory(new DefaultNodeFactory());
		this.registerElementFactory(new DefaultPortFactory());
	}

	getMaxNumberPointsPerLink(): number {
		return this.maxNumberPointsPerLink;
	}

	setMaxNumberPointsPerLink(max: number) {
		this.maxNumberPointsPerLink = max;
	}

	isSmartRoutingEnabled() {
		return this.smartRouting;
	}

	setSmartRoutingStatus(status: boolean) {
		this.smartRouting = status;
	}
}
