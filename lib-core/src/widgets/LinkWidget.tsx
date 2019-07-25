import * as React from 'react';
import { DiagramEngine } from '../DiagramEngine';
import { LinkModel } from '../models/LinkModel';

export interface LinkProps {
	link: LinkModel;
	diagramEngine: DiagramEngine;
}

export class LinkWidget extends React.Component<LinkProps> {

	shouldComponentUpdate() {
		return this.props.diagramEngine.canEntityRepaint(this.props.link);
	}

	render() {
		return this.props.children;
	}
}
