import * as React from "react";
import { DefaultLinkWidget } from "./DefaultLinkWidget";
import { DiagramEngine } from "../DiagramEngine";
import { LinkModel } from "../models/LinkModel";
import {LinkFactory} from "../AbstractFactory";
/**
 * @author Dylan Vorster
 */
export class DefaultLinkFactory extends LinkFactory {

	constructor() {
		super("default");
	}

	generateReactWidget(diagramEngine: DiagramEngine, link: LinkModel): JSX.Element {
		return React.createElement(DefaultLinkWidget, {
			link: link,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance(initialConfig?: any): LinkModel {
		return new LinkModel();
	}
}
