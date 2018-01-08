import { BaseEntity, BaseListener } from "../BaseEntity";
import * as _ from "lodash";
import { BaseEvent } from "../BaseEntity";

export interface BaseModelListener extends BaseListener {
	selectionChanged?(event: BaseEvent<BaseModel> & { isSelected: boolean }): void;

	entityRemoved?(event: BaseEvent<BaseModel>): void;
}

/**
 * @author Dylan Vorster
 */
export class BaseModel<T extends BaseModelListener = BaseModelListener> extends BaseEntity<BaseModelListener> {

	type: string;
	selected: boolean;

	constructor(type?: string, id?: string) {
		super(id);
		this.type = type;
		this.selected = false;
	}

	public getSelectedEntities(): BaseModel<T>[] {
		if (this.isSelected()) {
			return [this];
		}
		return [];
	}

	public deSerialize(ob) {
		super.deSerialize(ob);
		this.type = ob.type;
		this.selected = ob.selected;
	}

	public serialize() {
		return _.merge(super.serialize(), {
			type: this.type,
			selected: this.selected
		});
	}

	public getType(): string{
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
