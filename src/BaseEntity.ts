import {Toolkit} from "./Toolkit";
/**
 * @author Dylan Vorster
 */
export class BaseListener{
	lockChanged?(entity: BaseEntity<BaseListener>,locked: boolean): void;
}

export class BaseEntity<T extends BaseListener>{
	
	public listeners:{[s: string]: T};
	public id: string;
	public locked: boolean;
	
	constructor(){
		this.listeners = {};
		this.id = Toolkit.UID();
		this.locked = false;
	}
	
	getID(){
		return this.id;
	}
	
	clearListeners(){
		this.listeners = {};
	}
	
	public deSerialize(data){
		this.id = data.id;
	}
	
	public serialize(){
		return {
			id: this.id,
		}
	}
	
	public itterateListeners(cb: (t: T) => any){
		for (var i in this.listeners){
			cb(this.listeners[i]);
		}
	}
	
	public removeListener(listener: string){
		if (this.listeners[listener]){
			delete this.listeners[listener];
			return true;
		}
		return false;
	}
	
	public addListener(listener: T): string{
		var uid = Toolkit.UID();
		this.listeners[uid] = listener;
		return uid;
	}
	
	public isLocked(): boolean{
		return this.locked;
	}
	
	public setLocked(locked: boolean = true){
		this.locked = locked;
		this.itterateListeners((listener) => {
			if (listener.lockChanged){
				listener.lockChanged(this, locked);
			}
		});
	}
}