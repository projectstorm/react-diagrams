import * as React from "react";
import { DiagramModel } from "../DiagramModel";
import { DiagramEngine } from "../DiagramEngine";
import { PointModel } from "../Common";
import { LinkWidget } from "./LinkWidget";
import * as _ from "lodash";

export interface LinkLayerProps {
	diagramEngine: DiagramEngine;
	pointAdded: (point: PointModel, event) => any;
}

export interface LinkLayerState {}

/**
 * @author Dylan Vorster
 */
export class LinkLayerWidget extends React.Component<
	LinkLayerProps,
	LinkLayerState
> {
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
				{//only perform these actions when we have a diagram
				this.props.diagramEngine.canvas &&
					_.map(diagramModel.getLinks(), link => {
						//TODO just improve this vastly x_x
						if (link.sourcePort !== null) {
							//generate a point
							try {
								link.points[0].updateLocation(
									this.props.diagramEngine.getPortCenter(link.sourcePort)
								);
							} catch (ex) {}
						}
						if (link.targetPort !== null) {
							try {
								_.last(link.points).updateLocation(
									this.props.diagramEngine.getPortCenter(link.targetPort)
								);
							} catch (ex) {}
						}

						//generate links
						var generatedLink = this.props.diagramEngine.generateWidgetForLink(
							link
						);
						if (!generatedLink) {
							console.log("no link generated for type: " + link.getType());
							return null;
						}

						return (
							<LinkWidget
								key={link.getID()}
								link={link}
								diagramEngine={this.props.diagramEngine}
							>
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
