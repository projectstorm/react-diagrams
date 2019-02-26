import * as React from "react";
import { DiagramEngine } from "../DiagramEngine";
import { LinkModel } from "../models/LinkModel";
import { BaseWidget, BaseWidgetProps } from "./BaseWidget";

export interface LinkProps extends BaseWidgetProps {
	link: LinkModel;
	diagramEngine: DiagramEngine;
	children?: any;
	suppressUpdate?: boolean;
}

export interface LinkState { }

/**
 * @author Dylan Vorster
 */
export class LinkWidget extends BaseWidget<LinkProps, LinkState> {
	constructor(props: LinkProps) {
		super("srd-link", props);
		this.state = {};
	}

	shouldComponentUpdate(nextProps: LinkProps) {
		return !nextProps.suppressUpdate;
	}

	render() {
		return this.props.children;
	}
}
