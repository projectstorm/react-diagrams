import { LayerModel, LayerModelGenerics } from '@projectstorm/react-canvas-core';
import { LinkModel } from '../link/LinkModel';
import { DiagramEngine } from '../../DiagramEngine';

export interface LinkLayerModelGenerics extends LayerModelGenerics {
	CHILDREN: LinkModel;
	ENGINE: DiagramEngine;
}

export class LinkLayerModel<G extends LinkLayerModelGenerics = LinkLayerModelGenerics> extends LayerModel<G> {
	constructor() {
		super({
			type: 'diagram-links',
			isSvg: true,
			transformed: true
		});
	}

	addModel(model: G['CHILDREN']): void {
		if (!(model instanceof LinkModel)) {
			throw new Error('Can only add links to this layer');
		}
		super.addModel(model);
	}

	getLinks() {
		return this.getModels();
	}

	getChildModelFactoryBank(engine: G['ENGINE']) {
		return engine.getLinkFactories();
	}
}
