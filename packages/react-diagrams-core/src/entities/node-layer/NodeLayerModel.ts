import {LayerModel, LayerModelGenerics} from "@projectstorm/react-canvas-core";
import {NodeModel} from "../node/NodeModel";

export interface NodeLayerModelGenerics extends LayerModelGenerics{
	CHILDREN: NodeModel
}

export class NodeLayerModel<G extends NodeLayerModelGenerics = NodeLayerModelGenerics> extends LayerModel<G>{

	constructor(){
		super({
			type: 'diagram-nodes',
			isSvg: false,
			transformed: true,
		})
	}

	getNodes(){
		return this.getModels();
	}

}
