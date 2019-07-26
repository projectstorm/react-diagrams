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
				this.props.diagramEngine.canvas &&
					_.map(diagramModel.getLinks(), link => {
						if (
							this.props.diagramEngine.nodesRendered &&
							!this.props.diagramEngine.linksThatHaveInitiallyRendered[link.getID()]
						) {
							if (link.getSourcePort() != null) {
								try {
									const portCenter = this.props.diagramEngine.getPortCenter(link.getSourcePort());
									link.getPoints()[0].setPosition(portCenter);

									const portCoords = this.props.diagramEngine.getPortCoords(link.getSourcePort());
									link.getSourcePort().updateCoords(portCoords);

									this.props.diagramEngine.linksThatHaveInitiallyRendered[link.getID()] = true;
								} catch (ignore) {
									/*noop*/
								}
							}
							if (link.getTargetPort() !== null) {
								try {
									const portCenter = this.props.diagramEngine.getPortCenter(link.getTargetPort());
									_.last(link.getPoints()).setPosition(portCenter);

									const portCoords = this.props.diagramEngine.getPortCoords(link.getTargetPort());
									link.getTargetPort().updateCoords(portCoords);

									this.props.diagramEngine.linksThatHaveInitiallyRendered[link.getID()] = true;
								} catch (ignore) {
									/*noop*/
								}
							}
						}

						//generate links
						var generatedLink = this.props.diagramEngine.generateWidgetForLink(link);
						if (!generatedLink) {
							throw new Error(`no link generated for type: ${link.getType()}`);
						}

						return (
							<LinkWidget key={link.getID()} link={link} diagramEngine={this.props.diagramEngine}>
								{React.cloneElement(generatedLink, {
									pointAdded: this.props.pointAdded
								})}
							</LinkWidget>
						);
					})}
			</svg>
		);
	}
}
