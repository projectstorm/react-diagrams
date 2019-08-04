import {LayerModel, LayerModelGenerics} from "@projectstorm/react-canvas-core";
import {LinkModel} from "../link/LinkModel";

export interface LinkLayerModelGenerics extends LayerModelGenerics{
	CHILDREN: LinkModel;
}

export class LinkLayerModel<G extends LinkLayerModelGenerics = LinkLayerModelGenerics> extends LayerModel<G>{

	constructor(){
		super({
			type: 'diagram-links',
			isSvg: true,
			transformed: true,
		})
	}

	getLinks(){
		return this.getModels();
	}
}
