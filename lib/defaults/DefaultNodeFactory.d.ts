/// <reference types="react" />
import { NodeWidgetFactory } from "../WidgetFactories";
import { NodeModel } from "../Common";
import { DiagramEngine } from "../DiagramEngine";
/**
 * @author Dylan Vorster
 */
export declare class DefaultNodeFactory extends NodeWidgetFactory {
    constructor();
    generateReactWidget(diagramEngine: DiagramEngine, node: NodeModel): JSX.Element;
}
