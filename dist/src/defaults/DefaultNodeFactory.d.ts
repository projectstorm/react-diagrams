/// <reference types="react" />
import { NodeWidgetFactory } from "../WidgetFactories";
import { DefaultNodeModel } from "./DefaultNodeModel";
import { DiagramEngine } from "../DiagramEngine";
/**
 * @author Dylan Vorster
 */
export declare class DefaultNodeFactory extends NodeWidgetFactory {
    constructor();
    generateReactWidget(diagramEngine: DiagramEngine, node: DefaultNodeModel): JSX.Element;
}
