import { Toolkit } from './Toolkit';
import * as _ from 'lodash';
import { DiagramEngine } from './DiagramEngine';
import {BaseEvent, BaseListener, BaseObserver} from "./core/BaseObserver";

export interface BaseEntityEvent<T extends BaseEntity = BaseEntity> extends BaseEvent{
	entity: T;
	id: string;
}

export interface BaseEntityListener<T extends BaseEntity = BaseEntity> extends BaseListener{
	lockChanged?(event: BaseEntityEvent<T> & { locked: boolean }): void;
}

export type BaseEntityType = 'node' | 'link' | 'port' | 'point';

export class BaseEntity<T extends BaseListener = BaseListener> extends BaseObserver<T>{

	protected id: string;
	protected locked: boolean;

	constructor(id?: string) {
		super();
		this.id = id || Toolkit.UID();
		this.locked = false;
	}

	getID() {
		return this.id;
	}

	doClone(lookupTable: { [s: string]: any } = {}, clone: any) {
		/*noop*/
	}

	clone(lookupTable: { [s: string]: any } = {}) {
		// try and use an existing clone first
		if (lookupTable[this.id]) {
			return lookupTable[this.id];
		}
		let clone = _.clone(this);
		clone.id = Toolkit.UID();
		clone.clearListeners();
		lookupTable[this.id] = clone;

		this.doClone(lookupTable, clone);
		return clone;
	}

	clearListeners() {
		this.listeners = {};
	}

	public deSerialize(data: { [s: string]: any }, engine: DiagramEngine) {
		this.id = data.id;
	}

	public serialize() {
		return {
			id: this.id
		};
	}

	fireEvent(event: Partial<BaseEntityEvent> & object, k: keyof T) {
		super.fireEvent({
			id: Toolkit.UID(),
			...event,
		}, k);
	}

	public isLocked(): boolean {
		return this.locked;
	}

	public setLocked(locked: boolean = true) {
		this.locked = locked;
		this.fireEvent({
			locked: locked
		}, 'lockChanged');
	}
}
