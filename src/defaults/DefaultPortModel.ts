import {PortModel} from "../Common";
import * as _ from "lodash";
import {AbstractInstanceFactory} from "../AbstractInstanceFactory";

export class DefaultPortInstanceFactory extends AbstractInstanceFactory<DefaultPortModel>{
	
	constructor(){
		super("DefaultPortModel");
	}
	
	getInstance(){
		return new DefaultPortModel(true,"unknown");
	}
}

/**
 * @author Dylan Vorster
 */
export class DefaultPortModel extends PortModel{
	in: boolean;
	label: string;
	
	constructor(isInput:boolean,name: string,label: string = null){
		super(name);
		this.in = isInput;
		this.label = label || name;
	}
	
	serialize(){
		return _.merge(super.serialize(),{
			in: this.in,
			label: this.label,
		});
	}
}