import { NodeWidgetFactory } from "../WidgetFactories";
import * as React from "react";
import { DefaultNodeWidget } from "./DefaultNodeWidget";
/**
 * @author Dylan Vorster
 */
export class DefaultNodeFactory extends NodeWidgetFactory {
    constructor() {
        super("default");
    }
    generateReactWidget(diagramEngine, node) {
        return React.createElement(DefaultNodeWidget, {
            node: node,
            diagramEngine: diagramEngine,
            color: node.extras['color'],
            name: node.extras['name'],
            inPorts: node.extras['inPorts'],
            outPorts: node.extras['outPorts'],
        });
    }
}
