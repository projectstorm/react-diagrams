import { BaseModel } from "./BaseModel";
import { LinkModel } from "./LinkModel";

export class LabelModel extends BaseModel<LinkModel> {
	offsetX: number;
	offsetY: number;

	constructor(type?: string, id?: string) {
		super(type, id);
		this.offsetX = 0;
		this.offsetY = 0;
	}
}
