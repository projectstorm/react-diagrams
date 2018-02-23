import {LabelModel} from "../../models/LabelModel";

export class DefaultLabelModel extends LabelModel {
	label: string;

	constructor(){
		super("default");
	}

	setLabel(label: string){
		this.label = label;
	}
}