import * as React from "react";
import { DiagramEngine } from "../../DiagramEngine";
import { NodeWidget } from "../NodeWidget";
import { NodeModel } from "../../models/NodeModel";
import * as _ from "lodash";

export interface NLWIProps {
	diagramEngine: DiagramEngine;
}

export class NodeLayerWidgetInner extends React.Component<NLWIProps> {
	public shouldComponentUpdate(nextProps) {
		var modelNext = nextProps.diagramEngine.getDiagramModel();

		var isCanvasMoving = modelNext.getIsCanvasMoving();
		return !isCanvasMoving;
	}

	public render() {
		var diagramModel = this.props.diagramEngine.getDiagramModel();
		return (
			<React.Fragment>
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
			</React.Fragment>
		);
	}
}
