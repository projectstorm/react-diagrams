import * as React from "react";
import {NodeModel} from "../Common";

interface NodeProps {
	node:NodeModel;
	children?: any;
}

interface NodeState {
}

/**
 * @author Dylan Vorster
 */
export class NodeWidget extends React.Component<NodeProps, NodeState> {

	constructor(props: NodeProps) {
		super(props);
		this.state = {
		}
	}

	render() {
		console.log(this.props.node);
		return (
			React.DOM.div({
				onMouseDown: () => {
					this.props.node.setSelected(true);
				},
				'data-nodeid': this.props.node.id,
				className: 'node' + (this.props.node.isSelected()?' selected':''),
				style:{
					top: this.props.node.y,
					left: this.props.node.x,
				}},
				React.cloneElement(this.props.children,{})
			)
		);
	}
}