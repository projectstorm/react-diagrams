import * as React from "react";
import { DiagramEngine } from "../../DiagramEngine";
import * as _ from "lodash";
import { NodeWidget } from "../NodeWidget";
import { NodeModel } from "../../models/NodeModel";
import { BaseWidget, BaseWidgetProps } from "../BaseWidget";

export interface NodeLayerProps extends BaseWidgetProps {
	diagramEngine: DiagramEngine;
}

export interface NodeLayerState {}

export class NodeLayerWidget extends BaseWidget<NodeLayerProps, NodeLayerState> {
	constructor(props: NodeLayerProps) {
		super("srd-node-layer", props);
		this.state = {};
	}

	updateNodeDimensions = () => {
		if (!this.props.diagramEngine.nodesRendered) {
			const diagramModel = this.props.diagramEngine.getDiagramModel();
			_.map(diagramModel.getNodes(), node => {
				node.updateDimensions(this.props.diagramEngine.getNodeDimensions(node));
			});
		}
	};

	componentDidUpdate() {
		this.updateNodeDimensions();
		this.props.diagramEngine.nodesRendered = true;
	}

	render() {
		var diagramModel = this.props.diagramEngine.getDiagramModel();
		return (
			<div
				{...this.getProps()}
				style={{
					transform:
						"translate(" +
						diagramModel.getOffsetX() +
						"px," +
						diagramModel.getOffsetY() +
						"px) scale(" +
						diagramModel.getZoomLevel() / 100.0 +
						")"
				}}
			>
				{_.map(diagramModel.getNodes(), (node: NodeModel) => {
					return React.createElement(
						NodeWidget,
						{
							diagramEngine: this.props.diagramEngine,
							key: node.id,
							node: node
						},
						this.props.diagramEngine.generateWidgetForNode(node)
					);
				})}
			</div>
		);
	}
}
