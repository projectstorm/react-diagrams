import * as React from "react";
import { DiagramModel } from "../DiagramModel";
import { DiagramEngine } from "../DiagramEngine";
import * as _ from "lodash";
import { NodeWidget } from "./NodeWidget";

export interface NodeLayerProps {
	diagramEngine: DiagramEngine;
}

export interface NodeLayerState {}

/**
 * @author Dylan Vorster
 */
export class NodeLayerWidget extends React.Component<
	NodeLayerProps,
	NodeLayerState
> {
	constructor(props: NodeLayerProps) {
		super(props);
		this.state = {};
	}

	render() {
		var diagramModel = this.props.diagramEngine.getDiagramModel();

		return (
			<div
				className="node-view"
				style={{
					transform:
						"scale(" +
						diagramModel.getZoomLevel() / 100.0 +
						") translate(" +
						diagramModel.getOffsetX() +
						"px," +
						diagramModel.getOffsetY() +
						"px)",
					width: "100%",
					height: "100%"
				}}
			>
				{_.map(diagramModel.getNodes(), node => {
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
