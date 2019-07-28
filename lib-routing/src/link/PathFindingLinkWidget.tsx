import * as React from 'react';
import * as _ from 'lodash';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import PathFinding from '../engine/PathFinding';
import { PathFindingLinkFactory } from './PathFindingLinkFactory';
import { PathFindingLinkModel } from './PathFindingLinkModel';

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
	public static defaultProps: PathFindingLinkWidgetProps = {
		color: 'black',
		width: 3,
		link: null,
		engine: null,
		factory: null,
		smooth: false,
		diagramEngine: null
	};

	refPaths: SVGPathElement[];
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
		this.props.link.setRenderedPaths(this.refPaths);
	}

	componentDidMount(): void {
		this.props.link.setRenderedPaths(this.refPaths);
	}

	componentWillUnmount(): void {
		this.props.link.setRenderedPaths([]);
	}

	generateLink(path: string, id: string | number): JSX.Element {
		let Bottom = (
			<path
				fill="none"
				strokeWidth={this.props.width}
				stroke={this.props.color}
				ref={ref => ref && this.refPaths.push(ref)}
				d={path}
			/>
		);

		var Top = React.cloneElement(Bottom, {
			strokeLinecap: 'round',
			onMouseLeave: () => {
				this.setState({ selected: false });
			},
			onMouseEnter: () => {
				this.setState({ selected: true });
			},
			ref: null,
			'data-linkid': this.props.link.getID(),
			strokeOpacity: this.state.selected ? 0.1 : 0,
			strokeWidth: 20,
			fill: 'none',
			onContextMenu: () => {
				if (!this.props.diagramEngine.isModelLocked(this.props.link)) {
					event.preventDefault();
					this.props.link.remove();
				}
			}
		});

		return (
			<g key={'link-' + id}>
				{Bottom}
				{Top}
			</g>
		);
	}

	render() {
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

		this.refPaths = [];
		return <>{paths}</>;
	}
}
