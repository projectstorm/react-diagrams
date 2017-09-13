import { LinkWidgetFactory } from "../WidgetFactories";
import { LinkModel } from "../Common";
import * as React from "react";
import { DefaultLinkWidget } from "./DefaultLinkWidget";
import { DiagramEngine } from "../DiagramEngine";
/**
 * @author Dylan Vorster
 */
export class DefaultLinkFactory extends LinkWidgetFactory {
	constructor() {
		super("default");
	}

	generateReactWidget(
		diagramEngine: DiagramEngine,
		link: LinkModel
	): JSX.Element {
		return React.createElement(DefaultLinkWidget, {
			link: link,
			diagramEngine: diagramEngine
		});
	}
}
