import { BaseModel, BaseModelGenerics, BaseModelListener } from "./BaseModel";
import { DiagramEngine } from "../DiagramEngine";
import { BaseEntityEvent } from "./BaseEntity";

export interface BasePositionModelListener extends BaseModelListener{
	positionChanged?(event: BaseEntityEvent<BasePositionModel>): void;
}

export interface BasePositionModelGenerics extends BaseModelGenerics{
	LISTENER: BasePositionModelListener;
}

export class BasePositionModel<G extends BasePositionModelGenerics = BasePositionModelGenerics> extends BaseModel<G>{

	protected x: number;
	protected y: number;

	setPosition(x, y) {
		this.x = x;
		this.y = y;
		this.fireEvent({}, 'positionChanged');
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.x = ob.x;
		this.y = ob.y;
	}

	serialize() {
		return {
			...super.serialize(),
			x: this.x,
			y: this.y
		}
	}

	getX() {
		return this.x;
	}

	getY(){
		return this.y;
	}

}
