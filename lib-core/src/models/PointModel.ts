import { BaseModel, BaseModelListener, BaseModelOptions } from '../core-models/BaseModel';
import { LinkModel } from './LinkModel';
import * as _ from 'lodash';
import { DiagramEngine } from '../DiagramEngine';
import { BasePositionModel } from '../core-models/BasePositionModel';

export interface PointModelOptions extends Omit<PointModelOptions, 'type'> {
	link: LinkModel;
	points: { x: number; y: number };
}

export interface PointModelGenerics {
	PARENT: LinkModel;
	OPTIONS: PointModelOptions;
	LISTENER: BaseModelListener;
}

export class PointModel<G extends PointModelGenerics = PointModelGenerics> extends BasePositionModel<
	G & { OPTIONS: BaseModelOptions }
> {
	constructor(options: G['OPTIONS']) {
		super({
			...options,
			type: 'point'
		});
		this.x = options.points.x;
		this.y = options.points.y;
	}

	getSelectedEntities() {
		if (super.isSelected() && !this.isConnectedToPort()) {
			return [this];
		}
		return [];
	}

	isConnectedToPort(): boolean {
		return this.parent.getPortForPoint(this) !== null;
	}

	getLink(): LinkModel {
		return this.getParent();
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.options.points.x = ob.x;
		this.options.points.y = ob.y;
	}

	serialize() {
		return _.merge(super.serialize(), {
			x: this.options.points.x,
			y: this.options.points.y
		});
	}

	remove() {
		//clear references
		if (this.parent) {
			this.parent.removePoint(this);
		}
		super.remove();
	}

	updateLocation(points: { x: number; y: number }) {
		this.options.points.x = points.x;
		this.options.points.y = points.y;
	}

	getX(): number {
		return this.options.points.x;
	}

	getY(): number {
		return this.options.points.y;
	}

	isLocked() {
		return super.isLocked() || this.getParent().isLocked();
	}
}
