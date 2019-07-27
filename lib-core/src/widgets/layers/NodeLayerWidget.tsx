import * as React from 'react';
import { DiagramEngine } from '../../DiagramEngine';
import * as _ from 'lodash';
import { NodeWidget } from '../NodeWidget';
import { NodeModel } from '../../models/NodeModel';
import { BaseWidget, BaseWidgetProps } from '../BaseWidget';

export interface NodeLayerProps extends BaseWidgetProps {
	diagramEngine: DiagramEngine;
}

export class NodeLayerWidget extends BaseWidget<NodeLayerProps> {
	constructor(props: NodeLayerProps) {
		super('srd-node-layer', props);
	}

	render() {
		var diagramModel = this.props.diagramEngine.getDiagramModel();
		return (
			<div
				{...this.getProps()}
				style={{
					transform:
						'translate(' +
						diagramModel.getOffsetX() +
						'px,' +
						diagramModel.getOffsetY() +
						'px) scale(' +
						diagramModel.getZoomLevel() / 100.0 +
						')'
				}}>
				{_.map(diagramModel.getNodes(), (node: NodeModel) => {
					return <NodeWidget key={node.getID()} diagramEngine={this.props.diagramEngine} node={node} />;
				})}
			</div>
		);
	}
}
