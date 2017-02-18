import { LinkWidgetFactory } from "../WidgetFactories";
import * as React from "react";
import { DefaultLinkWidget } from "./DefaultLinkWidget";
/**
 * @author Dylan Vorster
 */
export class DefaultLinkFactory extends LinkWidgetFactory {
    constructor() {
        super("default");
    }
    generateReactWidget(diagramEngine, link) {
        return React.createElement(DefaultLinkWidget, {
            link: link,
            diagramEngine: diagramEngine
        });
    }
}
