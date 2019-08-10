import { BaseModel, BaseModelGenerics, BaseModelListener, BaseModelOptions } from './BaseModel';
import { CanvasEngine } from '../CanvasEngine';
import { BaseEntityEvent } from './BaseEntity';
import { Point } from '@projectstorm/geometry';

export interface BasePositionModelListener extends BaseModelListener {
	positionChanged?(event: BaseEntityEvent<BasePositionModel>): void;
}

export interface BasePositionModelOptions extends BaseModelOptions {
	position?: Point;
}

export interface BasePositionModelGenerics extends BaseModelGenerics {
	LISTENER: BasePositionModelListener;
	OPTIONS: BasePositionModelOptions;
}

export class BasePositionModel<G extends BasePositionModelGenerics = BasePositionModelGenerics> extends BaseModel<G> {
	protected position: Point;

	constructor(options: G['OPTIONS']) {
		super(options);
		this.position = options.position || new Point(0, 0);
	}

	setPosition(point: Point);
	setPosition(x: number, y: number);
	setPosition(x, y?) {
		if (typeof x === 'object') {
			this.position = x;
		} else {
			this.position = new Point(x, y);
		}
		this.fireEvent({}, 'positionChanged');
	}

	deserialize(ob, engine: CanvasEngine) {
		super.deserialize(ob, engine);
		this.position = new Point(ob.x, ob.y);
	}

	serialize() {
		return {
			...super.serialize(),
			x: this.position.x,
			y: this.position.y
		};
	}

	getPosition(): Point {
		return this.position;
	}

	getX() {
		return this.position.x;
	}

	getY() {
		return this.position.y;
	}
}
