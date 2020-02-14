import { LayerModel, LayerModelGenerics } from '@projectstorm/react-canvas-core';
import { LinkModel } from '../link/LinkModel';
import { DiagramEngine } from '../../DiagramEngine';
export interface LinkLayerModelGenerics extends LayerModelGenerics {
    CHILDREN: LinkModel;
    ENGINE: DiagramEngine;
}
export declare class LinkLayerModel<G extends LinkLayerModelGenerics = LinkLayerModelGenerics> extends LayerModel<G> {
    constructor();
    addModel(model: G['CHILDREN']): void;
    getLinks(): {
        [id: string]: G["CHILDREN"];
    };
    getChildModelFactoryBank(engine: G['ENGINE']): import("../../../../react-canvas-core/dist/@types").FactoryBank<import("../../../../react-canvas-core/dist/@types").AbstractReactFactory<LinkModel<import("../link/LinkModel").LinkModelGenerics>, DiagramEngine>, import("../../../../react-canvas-core/dist/@types").FactoryBankListener<import("../../../../react-canvas-core/dist/@types").AbstractReactFactory<LinkModel<import("../link/LinkModel").LinkModelGenerics>, DiagramEngine>>>;
}
