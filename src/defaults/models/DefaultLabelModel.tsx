import {LabelModel} from "../../models/LabelModel";

export class DefaultLabelModel extends LabelModel {
	label: string;

	setLabel(label: string){
		this.label = label;
	}
}