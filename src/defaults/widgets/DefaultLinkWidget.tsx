import * as React from "react";
import {DiagramEngine} from "../../DiagramEngine";
import {PointModel} from "../../models/PointModel";
import {Toolkit} from "../../Toolkit";
import {DefaultLinkFactory} from "../factories/DefaultLinkFactory";
import {DefaultLinkModel} from "../models/DefaultLinkModel";
import PathFinding from "../../routing/PathFinding";
import * as _ from "lodash";

export interface DefaultLinkProps {
	color?: string;
	width?: number;
	smooth?: boolean;
	link: DefaultLinkModel;
	diagramEngine: DiagramEngine;
	pointAdded?: (point: PointModel, event: MouseEvent) => any;
}

export interface DefaultLinkState {
	selected: boolean;
}

export class DefaultLinkWidget extends React.Component<DefaultLinkProps, DefaultLinkState> {
	public static defaultProps: DefaultLinkProps = {
		color: "black",
		width: 3,
		link: null,
		engine: null,
		smooth: false,
		diagramEngine: null,
	};

	// DOM references to the label and paths (if label is given), used to calculate dynamic positioning
	refLabel: HTMLElement;
	refPaths: SVGPathElement[];

	pathFinding: PathFinding; // only set when smart routing is active

	constructor(props: DefaultLinkProps) {
		super(props);
		this.state = {
			selected: false
		};

		if (props.diagramEngine.isSmartRoutingEnabled()) {
			this.pathFinding = new PathFinding(this.props.diagramEngine);
		}
	}

	addPointToLink = (event: MouseEvent, index: number): void => {
		if (
			!event.shiftKey &&
			!this.props.diagramEngine.isModelLocked(this.props.link) &&
			this.props.link.points.length - 1 <= this.props.diagramEngine.getMaxNumberPointsPerLink()
		) {
			const point = new PointModel(this.props.link, this.props.diagramEngine.getRelativeMousePoint(event));
			point.setSelected(true);
			this.forceUpdate();
			this.props.link.addPoint(point, index);
			this.props.pointAdded(point, event);
		}
	};

	generatePoint(pointIndex: number): JSX.Element {
		let x = this.props.link.points[pointIndex].x;
		let y = this.props.link.points[pointIndex].y;

		return (
			<g key={"point-" + this.props.link.points[pointIndex].id}>
				<circle
					cx={x}
					cy={y}
					r={5}
					className={"point pointui" + (this.props.link.points[pointIndex].isSelected() ? " selected" : "")}
				/>
				<circle
					onMouseLeave={() => {
						this.setState({selected: false});
					}}
					onMouseEnter={() => {
						this.setState({selected: true});
					}}
					data-id={this.props.link.points[pointIndex].id}
					data-linkid={this.props.link.id}
					cx={x}
					cy={y}
					r={15}
					opacity={0}
					className={"point"}
				/>
			</g>
		);
	}

	generateLink(path: string, extraProps: any, id: string | number): JSX.Element {
		var props = this.props;

		var Bottom = (props.diagramEngine.getFactoryForLink(this.props.link) as DefaultLinkFactory)
			.generateLinkSegment(this.props.link, this.state.selected || this.props.link.isSelected(), path);


		var Top = React.cloneElement(Bottom, {
			...extraProps,
			strokeLinecap: "round",
			onMouseLeave: () => {
				this.setState({selected: false});
			},
			onMouseEnter: () => {
				this.setState({selected: true});
			},
			'data-linkid': this.props.link.getID(),
			strokeOpacity: this.state.selected ? 0.1 : 0,
			onContextMenu: () => {
				if (!this.props.diagramEngine.isModelLocked(this.props.link)) {
					event.preventDefault();
					this.props.link.remove();
				}
			}
		});

		return (
			<g key={"link-" + id}>
				{Bottom}
				{Top}
			</g>
		);
	}

	findPathAndRelativePositionToRenderLabel = (): { path: any; position: number; } => {
		// an array to hold all path lengths, making sure we hit the DOM only once to fetch this information
		const lengths = this.refPaths.map(path => path.getTotalLength());

		// calculate the point where we want to display the label
		let labelPosition = lengths.reduce((previousValue, currentValue) => previousValue + currentValue, 0) / 2;

		// find the path where the label will be rendered and calculate the relative position
		let pathIndex = 0;
		while (pathIndex < this.refPaths.length) {
			if (labelPosition - lengths[pathIndex] < 0) {
				return {
					path: this.refPaths[pathIndex],
					position: labelPosition
				};
			}

			// keep searching
			labelPosition -= lengths[pathIndex];
			pathIndex++;
		}
	};

	calculateLabelPosition = () => {
		if (!this.refLabel) {
			// no label? nothing to do here
			return;
		}

		const {path, position} = this.findPathAndRelativePositionToRenderLabel();

		const labelDimensions = {
			width: this.refLabel.offsetWidth,
			height: this.refLabel.offsetHeight
		};

		const pathCentre = path.getPointAtLength(position);

		const labelCoordinates = {
			x: pathCentre.x - labelDimensions.width / 2,
			y: pathCentre.y - labelDimensions.height / 2
		};
		console.log('render label');
		this.refLabel.setAttribute("style", `transform: translate(${labelCoordinates.x}px, ${labelCoordinates.y}px);`);
	};

	componentDidUpdate() {
		window.requestAnimationFrame(this.calculateLabelPosition);
	}

	componentDidMount() {
		window.requestAnimationFrame(this.calculateLabelPosition);
	}


	//HERE

	/**
	 * Smart routing is only applicable when all conditions below are true:
	 * - smart routing is set to true on the engine
	 * - current link is between two nodes (not between a node and an empty point)
	 * - no custom points exist along the line
	 */
	isSmartRoutingApplicable(): boolean {
		const {diagramEngine, link} = this.props;

		if (!diagramEngine.isSmartRoutingEnabled()) {
			return false;
		}

		if (link.points.length !== 2) {
			return false;
		}

		if (link.sourcePort === null || link.targetPort === null) {
			return false;
		}

		return true;
	}

	render() {
		const {diagramEngine} = this.props;
		if (!diagramEngine.nodesRendered) {
			return null;
		}

		//ensure id is present for all points on the path
		var points = this.props.link.points;

		var paths = [];
		let model = diagramEngine.getDiagramModel();

		if (this.isSmartRoutingApplicable()) {
			// first step: calculate a direct path between the points being linked
			const directPathCoords = this.pathFinding.calculateDirectPath(_.first(points), _.last(points));

			const routingMatrix = diagramEngine.getRoutingMatrix();
			// now we need to extract, from the routing matrix, the very first walkable points
			// so they can be used as origin and destination of the link to be created
			const smartLink = this.pathFinding.calculateLinkStartEndCoords(routingMatrix, directPathCoords);

			if (smartLink) {
				const {start, end, pathToStart, pathToEnd} = smartLink;

				// second step: calculate a path avoiding hitting other elements
				const simplifiedPath = this.pathFinding.calculateDynamicPath(
					routingMatrix,
					start,
					end,
					pathToStart,
					pathToEnd
				);

				paths.push(
					//smooth: boolean, extraProps: any, id: string | number, firstPoint: PointModel, lastPoint: PointModel
					this.generateLink(
						Toolkit.generateDynamicPath(simplifiedPath),
						{
							onMouseDown: event => {
								this.addPointToLink(event, 1);
							},
						},
						"0"
					)
				);
			}
		}

		// true when smart routing was skipped or not enabled.
		// See @link{#isSmartRoutingApplicable()}.
		if (paths.length === 0) {
			if (points.length === 2) {
				//draw the smoothing
				//if the points are too close, just draw a straight line
				var margin = 50;
				if (Math.abs(points[0].x - points[1].x) < 50) {
					margin = 5;
				}

				var pointLeft = points[0];
				var pointRight = points[1];

				//some defensive programming to make sure the smoothing is
				//always in the right direction
				if (pointLeft.x > pointRight.x) {
					pointLeft = points[1];
					pointRight = points[0];
				}

				paths.push(
					this.generateLink(
						Toolkit.generateCurvePath(pointLeft, pointRight, this.props.link.curvyness),
						{
							onMouseDown: event => {
								this.addPointToLink(event, 1);
							},
						},
						"0",
					)
				);

				// draw the link as dangeling
				if (this.props.link.targetPort === null) {
					paths.push(this.generatePoint(1));
				}
			} else {
				//draw the multiple anchors and complex line instead
				for (let i = 0; i < points.length - 1; i++) {
					paths.push(this.generateLink(
						Toolkit.generateLinePath(points[i], points[i + 1]),
						{
							"data-linkid": this.props.link.id,
							"data-point": i,
							onMouseDown: (event: MouseEvent) => {
								this.addPointToLink(event, i + 1);
							},
						},
						i,
					));
				}


				//render the circles
				for (var i = 1; i < points.length - 1; i++) {
					paths.push(this.generatePoint(i));
				}

				if (this.props.link.targetPort === null) {
					paths.push(this.generatePoint(points.length - 1));
				}
			}
		}

		// ensure we have the right references when a redraw occurs
		this.refLabel = null;
		this.refPaths = [];

		return (
			<g>
				{paths}
			</g>
		);
	}
}
