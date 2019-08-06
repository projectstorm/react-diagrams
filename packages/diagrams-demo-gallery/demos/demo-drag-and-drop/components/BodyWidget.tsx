import * as React from 'react';
import * as _ from 'lodash';
import { TrayWidget } from './TrayWidget';
import { Application } from '../Application';
import { TrayItemWidget } from './TrayItemWidget';
import { DefaultNodeModel } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../../helpers/DemoCanvasWidget';

export interface BodyWidgetProps {
	app: Application;
}

export interface BodyWidgetState {}

export class BodyWidget extends React.Component<BodyWidgetProps, BodyWidgetState> {
	constructor(props: BodyWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="body">
				<div className="header">
					<div className="title">Storm React Diagrams - Demo 5</div>
				</div>
				<div className="content">
					<TrayWidget>
						<TrayItemWidget model={{ type: 'in' }} name="In Node" color="rgb(192,255,0)" />
						<TrayItemWidget model={{ type: 'out' }} name="Out Node" color="rgb(0,192,255)" />
					</TrayWidget>
					<div
						className="diagram-layer"
						onDrop={event => {
							var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
							var nodesCount = _.keys(
								this.props.app
									.getDiagramEngine()
									.getModel()
									.getNodes()
							).length;

							var node: DefaultNodeModel = null;
							if (data.type === 'in') {
								node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'rgb(192,255,0)');
								node.addInPort('In');
							} else {
								node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'rgb(0,192,255)');
								node.addOutPort('Out');
							}
							var point = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
							node.setPosition(point);
							this.props.app
								.getDiagramEngine()
								.getModel()
								.addNode(node);
							this.forceUpdate();
						}}
						onDragOver={event => {
							event.preventDefault();
						}}>
						<DemoCanvasWidget>
							<CanvasWidget engine={this.props.app.getDiagramEngine()} />
						</DemoCanvasWidget>
					</div>
				</div>
			</div>
		);
	}
}
