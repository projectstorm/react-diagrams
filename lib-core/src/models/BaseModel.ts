import { BaseEntity, BaseEntityEvent, BaseEntityListener } from '../BaseEntity';
import * as _ from 'lodash';
import { DiagramEngine } from '../DiagramEngine';
import { PointModel } from '../models/PointModel';

export interface BaseModelListener extends BaseEntityListener {
	selectionChanged?(event: BaseEntityEvent<BaseModel> & { isSelected: boolean }): void;

	entityRemoved?(event: BaseEntityEvent<BaseModel>): void;
}

export class BaseModel<
	X extends BaseEntity = BaseEntity,
	T extends BaseModelListener = BaseModelListener
> extends BaseEntity<T> {
	protected type: string;
	protected selected: boolean;
	protected parent: X;

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

	public getSelectedEntities(): Array<BaseModel<any, T> | PointModel> {
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

		this.fireEvent(
			{
				isSelected: selected
			},
			'selectionChanged'
		);
	}

	public remove() {
		this.fireEvent({}, 'entityRemoved');
	}
}
