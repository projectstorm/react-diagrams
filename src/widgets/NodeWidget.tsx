import * as React from "react";
import { NodeModel } from "../Common";
import { DiagramEngine } from "../DiagramEngine";

export interface NodeProps {
	node: NodeModel;
	children?: any;
	diagramEngine: DiagramEngine;
}

export interface NodeState {}

/**
 * @author Dylan Vorster
 */
export class NodeWidget extends React.Component<NodeProps, NodeState> {
	constructor(props: NodeProps) {
		super(props);
		this.state = {};
	}

	shouldComponentUpdate() {
		return this.props.diagramEngine.canEntityRepaint(this.props.node);
	}

	render() {
		return (
			<div
				data-nodeid={this.props.node.id}
				className={"node" + (this.props.node.isSelected() ? " selected" : "")}
				style={{
					top: this.props.node.y,
					left: this.props.node.x
				}}
			>
				{React.cloneElement(this.props.children, {})}
			</div>
		);
	}
}
