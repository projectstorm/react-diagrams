import { BaseAction } from "./BaseAction";

export class MouseAction extends BaseAction {
	mouseX: number;
	mouseY: number;

	constructor(mouseX: number, mouseY: number) {
		super();
		this.mouseX = mouseX;
		this.mouseY = mouseY;
	}
}
