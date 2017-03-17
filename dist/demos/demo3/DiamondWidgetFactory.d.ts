/// <reference types="react" />
import * as SRD from "../../src/main";
export declare class DiamondWidgetFactory extends SRD.NodeWidgetFactory {
    constructor();
    generateReactWidget(diagramEngine: SRD.DiagramEngine, node: SRD.NodeModel): JSX.Element;
}
