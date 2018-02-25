import * as React from "react";
import { DiagramEngine } from "../DiagramEngine";
import { NodeModel } from "../models/NodeModel";
import { Toolkit } from "../Toolkit";
import { BaseWidget, BaseWidgetProps } from "./BaseWidget";

export interface NodeProps extends BaseWidgetProps {
	node: NodeModel;
	children?: any;
	diagramEngine: DiagramEngine;
}

export interface NodeState {}

/**
 * @author Dylan Vorster
 */
export class NodeWidget extends BaseWidget<NodeProps, NodeState> {
	constructor(props: NodeProps) {
		super("srd-node", props);
		this.state = {};
	}

	shouldComponentUpdate() {
		return this.props.diagramEngine.canEntityRepaint(this.props.node);
	}

	getClassName() {
		return "node " + super.getClassName() + (this.props.node.isSelected() ? this.bem("--selected") : "");
	}

	render() {
		return (
			<div
				{...this.getProps()}
				data-nodeid={this.props.node.id}
				style={{
					top: this.props.node.y,
					left: this.props.node.x
				}}
			>
				{this.props.children}
			</div>
		);
	}
}
