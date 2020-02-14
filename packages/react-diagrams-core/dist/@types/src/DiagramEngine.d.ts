import { NodeModel } from './entities/node/NodeModel';
import { PortModel } from './entities/port/PortModel';
import { LinkModel } from './entities/link/LinkModel';
import { LabelModel } from './entities/label/LabelModel';
import { Point, Rectangle } from '@projectstorm/geometry';
import { MouseEvent } from 'react';
import { AbstractModelFactory, AbstractReactFactory, BaseModel, CanvasEngine, FactoryBank } from '@projectstorm/react-canvas-core';
import { CanvasEngineListener, CanvasEngineOptions } from '@projectstorm/react-canvas-core';
import { DiagramModel } from './models/DiagramModel';
/**
 * Passed as a parameter to the DiagramWidget
 */
export declare class DiagramEngine extends CanvasEngine<CanvasEngineListener, DiagramModel> {
    protected nodeFactories: FactoryBank<AbstractReactFactory<NodeModel, DiagramEngine>>;
    protected linkFactories: FactoryBank<AbstractReactFactory<LinkModel, DiagramEngine>>;
    protected portFactories: FactoryBank<AbstractModelFactory<PortModel, DiagramEngine>>;
    protected labelFactories: FactoryBank<AbstractReactFactory<LabelModel, DiagramEngine>>;
    maxNumberPointsPerLink: number;
    constructor(options?: CanvasEngineOptions);
    /**
     * Gets a model and element under the mouse cursor
     */
    getMouseElement(event: MouseEvent): BaseModel;
    getNodeFactories(): FactoryBank<AbstractReactFactory<NodeModel<import("./entities/node/NodeModel").NodeModelGenerics>, DiagramEngine>, import("../../react-canvas-core/dist/@types").FactoryBankListener<AbstractReactFactory<NodeModel<import("./entities/node/NodeModel").NodeModelGenerics>, DiagramEngine>>>;
    getLinkFactories(): FactoryBank<AbstractReactFactory<LinkModel<import("./entities/link/LinkModel").LinkModelGenerics>, DiagramEngine>, import("../../react-canvas-core/dist/@types").FactoryBankListener<AbstractReactFactory<LinkModel<import("./entities/link/LinkModel").LinkModelGenerics>, DiagramEngine>>>;
    getLabelFactories(): FactoryBank<AbstractReactFactory<LabelModel<import("./entities/label/LabelModel").LabelModelGenerics>, DiagramEngine>, import("../../react-canvas-core/dist/@types").FactoryBankListener<AbstractReactFactory<LabelModel<import("./entities/label/LabelModel").LabelModelGenerics>, DiagramEngine>>>;
    getPortFactories(): FactoryBank<AbstractModelFactory<PortModel<import("./entities/port/PortModel").PortModelGenerics>, DiagramEngine>, import("../../react-canvas-core/dist/@types").FactoryBankListener<AbstractModelFactory<PortModel<import("./entities/port/PortModel").PortModelGenerics>, DiagramEngine>>>;
    getFactoryForNode<F extends AbstractReactFactory<NodeModel, DiagramEngine>>(node: NodeModel | string): AbstractReactFactory<NodeModel<import("./entities/node/NodeModel").NodeModelGenerics>, DiagramEngine>;
    getFactoryForLink<F extends AbstractReactFactory<LinkModel, DiagramEngine>>(link: LinkModel | string): F;
    getFactoryForLabel<F extends AbstractReactFactory<LabelModel, DiagramEngine>>(label: LabelModel): AbstractReactFactory<LabelModel<import("./entities/label/LabelModel").LabelModelGenerics>, DiagramEngine>;
    getFactoryForPort<F extends AbstractModelFactory<PortModel, DiagramEngine>>(port: PortModel): F;
    generateWidgetForLink(link: LinkModel): JSX.Element;
    generateWidgetForNode(node: NodeModel): JSX.Element;
    getNodeElement(node: NodeModel): Element;
    getNodePortElement(port: PortModel): any;
    getPortCenter(port: PortModel): Point;
    /**
     * Calculate rectangular coordinates of the port passed in.
     */
    getPortCoords(port: PortModel, element?: HTMLDivElement): Rectangle;
    /**
     * Determine the width and height of the node passed in.
     * It currently assumes nodes have a rectangular shape, can be overriden for customised shapes.
     */
    getNodeDimensions(node: NodeModel): {
        width: number;
        height: number;
    };
    getMaxNumberPointsPerLink(): number;
    setMaxNumberPointsPerLink(max: number): void;
}
