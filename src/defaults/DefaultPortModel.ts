import {PortModel} from "../Common";
import * as _ from "lodash";
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
		return _.extend(super.serialize(),{
			in: this.in,
			label: this.label,
		});
	}
}