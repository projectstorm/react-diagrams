import {
	BaseEntityEvent,
	BaseModelOptions,
	DiagramEngine,
	LabelModel,
	LinkModel,
	LinkModelGenerics,
	LinkModelListener,
	PortModel,
	PortModelAlignment
} from '@projectstorm/react-diagrams-core';
import { DefaultLabelModel } from '../label/DefaultLabelModel';
import { BezierCurve } from '../../../lib-geometry/src/BezierCurve';

export interface DefaultLinkModelListener extends LinkModelListener {
	colorChanged?(event: BaseEntityEvent<DefaultLinkModel> & { color: null | string }): void;

	widthChanged?(event: BaseEntityEvent<DefaultLinkModel> & { width: 0 | number }): void;
}

export interface DefaultLinkModelOptions extends Omit<BaseModelOptions, 'type'> {
	width?: number;
	color?: string;
	curvyness?: number;
	type?: string;
}

export interface DefaultLinkModelGenerics {
	LISTENER: DefaultLinkModelListener;
	OPTIONS: DefaultLinkModelOptions;
}

export class DefaultLinkModel extends LinkModel<LinkModelGenerics & DefaultLinkModelGenerics> {
	constructor(options: DefaultLinkModelOptions = {}) {
		super({
			type: 'default',
			width: options.width || 3,
			color: options.color || 'gray',
			curvyness: 50,
			...options
		});
	}

	calculateControlOffset(port: PortModel): [number, number] {
		if (port.getOptions().alignment === PortModelAlignment.RIGHT) {
			return [this.options.curvyness, 0];
		} else if (port.getOptions().alignment === PortModelAlignment.LEFT) {
			return [-this.options.curvyness, 0];
		} else if (port.getOptions().alignment === PortModelAlignment.TOP) {
			return [0, -this.options.curvyness];
		}
		return [0, this.options.curvyness];
	}

	getSVGPath(): string {
		if (this.points.length == 2) {
			const curve = new BezierCurve();
			curve.setSource(this.getFirstPoint().getPosition());
			curve.setTarget(this.getLastPoint().getPosition());
			curve.setSourceControl(
				this.getFirstPoint()
					.getPosition()
					.clone()
			);
			curve.setTargetControl(
				this.getLastPoint()
					.getPosition()
					.clone()
			);

			if (this.sourcePort) {
				curve.getSourceControl().translate(...this.calculateControlOffset(this.getSourcePort()));
			}

			if (this.targetPort) {
				curve.getTargetControl().translate(...this.calculateControlOffset(this.getTargetPort()));
			}
			return curve.getSVGCurve();
		}
	}

	serialize() {
		return {
			...super.serialize(),
			width: this.options.width,
			color: this.options.color,
			curvyness: this.options.curvyness
		};
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.options.color = ob.color;
		this.options.width = ob.width;
		this.options.curvyness = ob.curvyness;
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
		this.options.width = width;
		this.fireEvent({ width }, 'widthChanged');
	}

	setColor(color: string) {
		this.options.color = color;
		this.fireEvent({ color }, 'colorChanged');
	}
}
