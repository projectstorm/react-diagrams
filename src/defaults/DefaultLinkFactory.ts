import { LinkWidgetFactory } from "../WidgetFactories";
import * as React from "react";
import { DefaultLinkWidget } from "./DefaultLinkWidget";
import { DiagramEngine } from "../DiagramEngine";
import { LinkModel } from "../models/LinkModel";
/**
 * @author Dylan Vorster
 */
export class DefaultLinkFactory extends LinkWidgetFactory {
	constructor() {
		super("default");
	}

	generateReactWidget(diagramEngine: DiagramEngine, link: LinkModel): JSX.Element {
		return React.createElement(DefaultLinkWidget, {
			link: link,
			diagramEngine: diagramEngine
		});
	}
}
