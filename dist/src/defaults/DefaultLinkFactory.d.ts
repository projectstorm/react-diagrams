/// <reference types="react" />
import { LinkWidgetFactory } from "../WidgetFactories";
import { LinkModel } from "../Common";
import { DiagramEngine } from "../DiagramEngine";
/**
 * @author Dylan Vorster
 */
export declare class DefaultLinkFactory extends LinkWidgetFactory {
    constructor();
    generateReactWidget(diagramEngine: DiagramEngine, link: LinkModel): JSX.Element;
}
