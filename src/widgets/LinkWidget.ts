import * as React from "react";
import {LinkModel} from "../Common";
import {DiagramEngine} from "../DiagramEngine";

interface LinkProps {
	link: LinkModel;
	diagramEngine: DiagramEngine;
	children?: any;
}

interface LinkState {
}

/**
 * @author Dylan Vorster
 */
export class LinkWidget extends React.Component<LinkProps, LinkState> {

	constructor(props: LinkProps) {
		super(props);
		this.state = {
		}
	}
	
	shouldComponentUpdate(){
		return this.props.diagramEngine.canEntityRepaint(this.props.link);
	}

	render() {
		return this.props.children;
	}
}