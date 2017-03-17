import {Toolkit} from "./Toolkit";
import {AbstractInstanceFactory} from "./AbstractInstanceFactory";
/**
 * @author Dylan Vorster
 */
export class BaseListener{
	
}

export class BaseEntity<T extends BaseListener>{
	
	public listeners:{[s: string]: T};
	public id: string;
	
	constructor(){
		this.listeners = {};
		this.id = Toolkit.UID();
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
}