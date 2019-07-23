export class BaseAction {
	mouseX: number;
	mouseY: number;
	ms: number;

	constructor(mouseX: number, mouseY: number) {
		this.mouseX = mouseX;
		this.mouseY = mouseY;
		this.ms = new Date().getTime();
	}
}
