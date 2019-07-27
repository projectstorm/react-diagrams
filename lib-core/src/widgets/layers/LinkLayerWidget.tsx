import * as React from 'react';
import { DiagramEngine } from '../../DiagramEngine';
import { LinkWidget } from '../LinkWidget';
import * as _ from 'lodash';
import { PointModel } from '../../models/PointModel';
import { BaseWidget, BaseWidgetProps } from '../BaseWidget';

export interface LinkLayerProps extends BaseWidgetProps {
	diagramEngine: DiagramEngine;
	pointAdded: (point: PointModel, event: MouseEvent) => any;
}

export class LinkLayerWidget extends BaseWidget<LinkLayerProps> {
	constructor(props: LinkLayerProps) {
		super('srd-link-layer', props);
	}

	render() {
		var diagramModel = this.props.diagramEngine.getDiagramModel();
		return (
			<svg
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
				{//only perform these actions when we have a diagram
				_.map(diagramModel.getLinks(), link => {
					return (
						<LinkWidget
							pointAdded={this.props.pointAdded}
							key={link.getID()}
							link={link}
							diagramEngine={this.props.diagramEngine}
						/>
					);
				})}
			</svg>
		);
	}
}
