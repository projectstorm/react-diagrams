import * as React from 'react';
import { DiagramEngine } from '../DiagramEngine';
import { NodeModel } from '../models/NodeModel';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';

export interface NodeProps extends BaseWidgetProps {
	node: NodeModel;
	children?: any;
	diagramEngine: DiagramEngine;
}

export class NodeWidget extends BaseWidget<NodeProps> {
	constructor(props: NodeProps) {
		super('srd-node', props);
	}

	shouldComponentUpdate() {
		return this.props.diagramEngine.canEntityRepaint(this.props.node);
	}

	getClassName() {
		return 'node ' + super.getClassName() + (this.props.node.isSelected() ? this.bem('--selected') : '');
	}

	render() {
		return (
			<div
				{...this.getProps()}
				data-nodeid={this.props.node.getID()}
				style={{
					top: this.props.node.getY(),
					left: this.props.node.getX()
				}}>
				{this.props.children}
			</div>
		);
	}
}
