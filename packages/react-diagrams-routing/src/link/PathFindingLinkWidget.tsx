import * as React from 'react';
import * as _ from 'lodash';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import PathFinding from '../engine/PathFinding';
import { PathFindingLinkFactory } from './PathFindingLinkFactory';
import { PathFindingLinkModel } from './PathFindingLinkModel';
import { DefaultLinkSegmentWidget } from '@projectstorm/react-diagrams-defaults';

export interface PathFindingLinkWidgetProps {
	color?: string;
	width?: number;
	smooth?: boolean;
	link: PathFindingLinkModel;
	diagramEngine: DiagramEngine;
	factory: PathFindingLinkFactory;
}

export interface PathFindingLinkWidgetState {
	selected: boolean;
}

export class PathFindingLinkWidget extends React.Component<PathFindingLinkWidgetProps, PathFindingLinkWidgetState> {
	refPaths: React.RefObject<SVGPathElement>[];
	pathFinding: PathFinding;

	constructor(props: PathFindingLinkWidgetProps) {
		super(props);
		this.refPaths = [];
		this.state = {
			selected: false
		};
		this.pathFinding = new PathFinding(this.props.factory);
	}

	componentDidUpdate(): void {
		this.props.link.setRenderedPaths(
			this.refPaths.map(ref => {
				return ref.current;
			})
		);
	}

	componentDidMount(): void {
		this.props.link.setRenderedPaths(
			this.refPaths.map(ref => {
				return ref.current;
			})
		);
	}

	componentWillUnmount(): void {
		this.props.link.setRenderedPaths([]);
	}

	generateLink(path: string, id: string | number): JSX.Element {
		const ref = React.createRef<SVGPathElement>();
		this.refPaths.push(ref);
		return (
			<DefaultLinkSegmentWidget
				key={`link-${id}`}
				path={path}
				selected={this.state.selected}
				diagramEngine={this.props.diagramEngine}
				factory={this.props.diagramEngine.getFactoryForLink(this.props.link)}
				link={this.props.link}
				forwardRef={ref}
				onSelection={selected => {
					this.setState({ selected: selected });
				}}
				extras={{}}
			/>
		);
	}

	render() {
		this.refPaths = [];
		//ensure id is present for all points on the path
		var points = this.props.link.getPoints();
		var paths = [];

		// first step: calculate a direct path between the points being linked
		const directPathCoords = this.pathFinding.calculateDirectPath(_.first(points), _.last(points));

		const routingMatrix = this.props.factory.getRoutingMatrix();
		// now we need to extract, from the routing matrix, the very first walkable points
		// so they can be used as origin and destination of the link to be created
		const smartLink = this.pathFinding.calculateLinkStartEndCoords(routingMatrix, directPathCoords);
		if (smartLink) {
			const { start, end, pathToStart, pathToEnd } = smartLink;

			// second step: calculate a path avoiding hitting other elements
			const simplifiedPath = this.pathFinding.calculateDynamicPath(routingMatrix, start, end, pathToStart, pathToEnd);

			paths.push(
				//smooth: boolean, extraProps: any, id: string | number, firstPoint: PointModel, lastPoint: PointModel
				this.generateLink(this.props.factory.generateDynamicPath(simplifiedPath), '0')
			);
		}
		return <>{paths}</>;
	}
}
