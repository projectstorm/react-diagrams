import {LabelModel} from "../../models/LabelModel";

export class DefaultLabelModel extends LabelModel {
	label: string;

	constructor(){
		super("default");
		this.offsetY = -23;
	}

	setLabel(label: string){
		this.label = label;
	}
}