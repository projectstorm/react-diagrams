import { LinkModel, LinkModelListener } from "../../models/LinkModel";
import * as _ from "lodash";
import { DefaultLabelModel } from "./DefaultLabelModel";
import { LabelModel } from "../../models/LabelModel";
import { BaseEvent, DeserializeEvent } from "@projectstorm/react-canvas";

export interface DefaultLinkModelListener extends LinkModelListener {
	colorChanged?(event: BaseEvent<DefaultLinkModel> & { color: null | string }): void;

	widthChanged?(event: BaseEvent<DefaultLinkModel> & { width: 0 | number }): void;
}

export class DefaultLinkModel extends LinkModel<DefaultLinkModelListener> {
	protected width: number;
	protected color: string;
	protected curvyness: number;

	constructor(type: string = "default") {
		super(type);
		this.color = "rgba(255,255,255,0.5)";
		this.width = 3;
		this.curvyness = 50;
	}

	serialize() {
		return _.merge(super.serialize(), {
			width: this.width,
			color: this.color,
			curvyness: this.curvyness
		});
	}

	deSerialize(event: DeserializeEvent) {
		super.deSerialize(event);
		this.color = event.data.color;
		this.width = event.data.width;
		this.curvyness = event.data.curvyness;
	}

	addLabel(label: LabelModel | string) {
		if (label instanceof LabelModel) {
			return super.addLabel(label);
		}
		let labelOb = new DefaultLabelModel();
		labelOb.setLabel(label);
		return super.addLabel(labelOb);
	}

	setWidth(width: number) {
		this.width = width;
		this.iterateListeners("width changed", (listener: DefaultLinkModelListener, event: BaseEvent) => {
			if (listener.widthChanged) {
				listener.widthChanged({ ...event, width: width });
			}
		});
	}

	setColor(color: string) {
		this.color = color;
		this.iterateListeners("color changed", (listener: DefaultLinkModelListener, event: BaseEvent) => {
			if (listener.colorChanged) {
				listener.colorChanged({ ...event, color: color });
			}
		});
	}

	getWidth() {
		return this.width;
	}

	getColor() {
		return this.color;
	}

	getCurvyness() {
		return this.curvyness;
	}
}
