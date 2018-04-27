import * as React from "react";
import { DiagramEngine } from "../DiagramEngine";
import { NodeModel } from "../models/NodeModel";
import { BaseWidget, BaseWidgetProps } from "@projectstorm/react-canvas";

export interface NodeProps extends BaseWidgetProps {
	node: NodeModel;
	children?: any;
	diagramEngine: DiagramEngine;
}

export interface NodeState {}

export class NodeWidget extends BaseWidget<NodeProps, NodeState> {
	constructor(props: NodeProps) {
		super("srd-node", props);
		this.state = {};
	}

	getClassName() {
		return "node " + super.getClassName() + (this.props.node.isSelected() ? this.bem("--selected") : "");
	}

	render() {
		return (
			<div
				{...this.getProps()}
				data-nodeid={this.props.node.getID()}
				style={{
					top: this.props.node.getDimensions().getTopLeft().y,
					left: this.props.node.getDimensions().getTopLeft().x
				}}
			>
				{this.props.children}
			</div>
		);
	}
}
