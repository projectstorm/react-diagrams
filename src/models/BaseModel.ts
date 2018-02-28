import { BaseEntity, BaseListener } from "../BaseEntity";
import * as _ from "lodash";
import { BaseEvent } from "../BaseEntity";
import { DiagramEngine } from "../DiagramEngine";

export interface BaseModelListener extends BaseListener {
	selectionChanged?(event: BaseEvent<BaseModel> & { isSelected: boolean }): void;

	entityRemoved?(event: BaseEvent<BaseModel>): void;
}

/**
 * @author Dylan Vorster
 */
export class BaseModel<
	X extends BaseEntity = BaseEntity,
	T extends BaseModelListener = BaseModelListener
> extends BaseEntity<T> {
	type: string;
	selected: boolean;
	parent: X;

	constructor(type?: string, id?: string) {
		super(id);
		this.type = type;
		this.selected = false;
	}

	public getParent(): X {
		return this.parent;
	}

	public setParent(parent: X) {
		this.parent = parent;
	}

	public getSelectedEntities(): BaseModel<any, T>[] {
		if (this.isSelected()) {
			return [this];
		}
		return [];
	}

	public deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.type = ob.type;
		this.selected = ob.selected;
	}

	public serialize() {
		return _.merge(super.serialize(), {
			type: this.type,
			selected: this.selected
		});
	}

	public getType(): string {
		return this.type;
	}

	public getID(): string {
		return this.id;
	}

	public isSelected(): boolean {
		return this.selected;
	}

	public setSelected(selected: boolean = true) {
		this.selected = selected;
		this.iterateListeners((listener, event) => {
			if (listener.selectionChanged) {
				listener.selectionChanged({ ...event, isSelected: selected });
			}
		});
	}

	public remove() {
		this.iterateListeners((listener, event) => {
			if (listener.entityRemoved) {
				listener.entityRemoved(event);
			}
		});
	}
}
