import {PortModel} from "../Common";
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
}