import * as _ from 'lodash';
import {
	BaseEntityEvent,
	DiagramEngine,
	LabelModel,
	LinkModel,
	LinkModelListener
} from '@projectstorm/react-diagrams-core';
import { DefaultLabelModel } from '../label/DefaultLabelModel';

export interface DefaultLinkModelListener extends LinkModelListener {
	colorChanged?(event: BaseEntityEvent<DefaultLinkModel> & { color: null | string }): void;

	widthChanged?(event: BaseEntityEvent<DefaultLinkModel> & { width: 0 | number }): void;
}

export class DefaultLinkModel extends LinkModel<DefaultLinkModelListener> {
	width: number;
	color: string;
	curvyness: number;

	constructor(type: string = 'default') {
		super(type);
		this.color = 'rgba(255,255,255,0.5)';
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

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.color = ob.color;
		this.width = ob.width;
		this.curvyness = ob.curvyness;
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
		this.fireEvent({width}, 'widthChanged');
	}

	setColor(color: string) {
		this.color = color;
		this.fireEvent({color}, 'colorChanged');
	}
}
