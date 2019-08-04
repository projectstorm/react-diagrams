import { LayerModel } from '../layer/LayerModel';

export class SelectionLayerModel extends LayerModel {
	box: ClientRect;

	constructor() {
		super({
			transformed: false,
			isSvg: false,
			type: 'selection'
		});
	}

	setBox(rect: ClientRect) {
		this.box = rect;
	}
}
