import {BaseEntity, BaseListener} from "./BaseEntity";
/**
 * @author Dylan Vorster
 */
export abstract class AbstractInstanceFactory<T extends BaseEntity<BaseListener>>{

	className: string;

	constructor(className: string){
		this.className = className;
	}

	getName(){
		return this.className;
	}

	abstract getInstance(initialConfig?:any): T;
}