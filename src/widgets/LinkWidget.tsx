import * as React from "react";
import { DiagramEngine } from "../DiagramEngine";
import {LinkModel} from "../models/LinkModel";

export interface LinkProps {
	link: LinkModel;
	diagramEngine: DiagramEngine;
	children?: any;
}

export interface LinkState {}

/**
 * @author Dylan Vorster
 */
export class LinkWidget extends React.Component<LinkProps, LinkState> {
	constructor(props: LinkProps) {
		super(props);
		this.state = {};
	}

	shouldComponentUpdate() {
		return this.props.diagramEngine.canEntityRepaint(this.props.link);
	}

	render() {
		return this.props.children;
	}
}
