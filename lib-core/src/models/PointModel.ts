import { BaseModelListener, BaseModelOptions } from '../core-models/BaseModel';
import { LinkModel } from './LinkModel';
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
		this.parent = options.link;
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

	remove() {
		//clear references
		if (this.parent) {
			this.parent.removePoint(this);
		}
		super.remove();
	}

	updateLocation(points: { x: number; y: number }) {
		this.setPosition(points.x, points.y);
	}

	isLocked() {
		return super.isLocked() || this.getParent().isLocked();
	}
}
