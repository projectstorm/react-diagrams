import { LinkModel } from './LinkModel';
import {
	BaseModelListener,
	BasePositionModel,
	BasePositionModelGenerics,
	BasePositionModelOptions
} from '@projectstorm/react-canvas-core';

export interface PointModelOptions extends Omit<BasePositionModelOptions, 'type'> {
	link: LinkModel;
}

export interface PointModelGenerics {
	PARENT: LinkModel;
	OPTIONS: PointModelOptions;
	LISTENER: BaseModelListener;
}

export class PointModel<G extends PointModelGenerics = PointModelGenerics> extends BasePositionModel<
	G & BasePositionModelGenerics
> {
	constructor(options: G['OPTIONS']) {
		super({
			...options,
			type: 'point'
		});
		this.parent = options.link;
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

	isLocked() {
		return super.isLocked() || this.getParent().isLocked();
	}
}
