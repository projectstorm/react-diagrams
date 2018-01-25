import * as React from "react";
import { DiagramEngine } from "../DiagramEngine";
import { LinkWidget } from "./LinkWidget";
import * as _ from "lodash";
import { PointModel } from "../models/PointModel";

export interface LinkLayerProps {
	diagramEngine: DiagramEngine;
	pointAdded: (point: PointModel, event: MouseEvent) => any;
}

export interface LinkLayerState {}

/**
 * @author Dylan Vorster
 */
export class LinkLayerWidget extends React.Component<LinkLayerProps, LinkLayerState> {
	constructor(props: LinkLayerProps) {
		super(props);
		this.state = {};
	}

	render() {
		var diagramModel = this.props.diagramEngine.getDiagramModel();
		return (
			<svg
				style={{
					transform:
						"translate(" +
						diagramModel.getOffsetX() +
						"px," +
						diagramModel.getOffsetY() +
						"px) scale(" +
						diagramModel.getZoomLevel() / 100.0 +
						")",
					width: "100%",
					height: "100%"
				}}
			>
				{//only perform these actions when we have a diagram
				this.props.diagramEngine.canvas &&
					_.map(diagramModel.getLinks(), link => {
						if (
							this.props.diagramEngine.nodesRendered &&
							!this.props.diagramEngine.linksThatHaveInitiallyRendered[link.id]
						) {
							if (link.sourcePort !== null) {
								try {
									link.points[0].updateLocation(
										this.props.diagramEngine.getPortCenter(link.sourcePort)
									);
									this.props.diagramEngine.linksThatHaveInitiallyRendered[link.id] = true;
								} catch (ex) {}
							}
							if (link.targetPort !== null) {
								try {
									_.last(link.points).updateLocation(
										this.props.diagramEngine.getPortCenter(link.targetPort)
									);
									this.props.diagramEngine.linksThatHaveInitiallyRendered[link.id] = true;
								} catch (ex) {}
							}
						}

						//generate links
						var generatedLink = this.props.diagramEngine.generateWidgetForLink(link);
						if (!generatedLink) {
							console.log("no link generated for type: " + link.getType());
							return null;
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
