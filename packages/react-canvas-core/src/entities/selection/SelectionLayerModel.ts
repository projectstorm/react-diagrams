import { LayerModel } from '../layer/LayerModel';
import { FactoryBank } from '../../core/FactoryBank';
import { AbstractModelFactory } from '../../core/AbstractModelFactory';
import { BaseModel } from '../../core-models/BaseModel';
import { SimpleClientRect } from '../../states/SelectionBoxState';

export class SelectionLayerModel extends LayerModel {
	box: SimpleClientRect;

	constructor() {
		super({
			transformed: false,
			isSvg: false,
			type: 'selection'
		});
	}

	setBox(rect: SimpleClientRect) {
		this.box = rect;
	}

	getChildModelFactoryBank(): FactoryBank<AbstractModelFactory<BaseModel>> {
		// is not used as it doesnt serialize
		return null;
	}
}
