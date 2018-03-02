import * as React from "react";
import { DiagramEngine } from "../../DiagramEngine";
import { PointModel } from "../../models/PointModel";
import { Toolkit } from "../../Toolkit";
import { DefaultLinkFactory } from "../factories/DefaultLinkFactory";
import { DefaultLinkModel } from "../models/DefaultLinkModel";
import PathFinding from "../../routing/PathFinding";
import * as _ from "lodash";
import { LabelModel } from "../../models/LabelModel";
import { BaseWidget, BaseWidgetProps } from "../../widgets/BaseWidget";

export interface DefaultLinkProps extends BaseWidgetProps {
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

export class DefaultLinkWidget extends BaseWidget<DefaultLinkProps, DefaultLinkState> {
	public static defaultProps: DefaultLinkProps = {
		color: "black",
		width: 3,
		link: null,
		engine: null,
		smooth: false,
		diagramEngine: null
	};

	// DOM references to the label and paths (if label is given), used to calculate dynamic positioning
	refLabels: { [id: string]: HTMLElement };
	refPaths: SVGPathElement[];

	pathFinding: PathFinding; // only set when smart routing is active

	constructor(props: DefaultLinkProps) {
		super("srd-default-link", props);

		this.refLabels = {};
		this.refPaths = [];
		this.state = {
			selected: false
		};

		if (props.diagramEngine.isSmartRoutingEnabled()) {
			this.pathFinding = new PathFinding(this.props.diagramEngine);
		}
	}

	calculateAllLabelPosition() {
		_.forEach(this.props.link.labels, (label, index) => {
			this.calculateLabelPosition(label, index + 1);
		});
	}

	componentDidUpdate() {
		if (this.props.link.labels.length > 0) {
			window.requestAnimationFrame(this.calculateAllLabelPosition.bind(this));
		}
	}

	componentDidMount() {
		if (this.props.link.labels.length > 0) {
			window.requestAnimationFrame(this.calculateAllLabelPosition.bind(this));
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
					className={
						"point " +
						this.bem("__point") +
						(this.props.link.points[pointIndex].isSelected() ? this.bem("--point-selected") : "")
					}
				/>
				<circle
					onMouseLeave={() => {
						this.setState({ selected: false });
					}}
					onMouseEnter={() => {
						this.setState({ selected: true });
					}}
					data-id={this.props.link.points[pointIndex].id}
					data-linkid={this.props.link.id}
					cx={x}
					cy={y}
					r={15}
					opacity={0}
					className={"point " + this.bem("__point")}
				/>
			</g>
		);
	}

	generateLabel(label: LabelModel) {
		const canvas = this.props.diagramEngine.canvas as HTMLElement;
		return (
			<foreignObject
				key={label.id}
				className={this.bem("__label")}
				width={canvas.offsetWidth}
				height={canvas.offsetHeight}
			>
				<div ref={ref => (this.refLabels[label.id] = ref)}>
					{this.props.diagramEngine
						.getFactoryForLabel(label)
						.generateReactWidget(this.props.diagramEngine, label)}
				</div>
			</foreignObject>
		);
	}

	generateLink(path: string, extraProps: any, id: string | number): JSX.Element {
		var props = this.props;

		var Bottom = React.cloneElement(
			(props.diagramEngine.getFactoryForLink(this.props.link) as DefaultLinkFactory).generateLinkSegment(
				this.props.link,
				this,
				this.state.selected || this.props.link.isSelected(),
				path
			),
			{
				ref: ref => ref && this.refPaths.push(ref)
			}
		);

		var Top = React.cloneElement(Bottom, {
			...extraProps,
			strokeLinecap: "round",
			onMouseLeave: () => {
				this.setState({ selected: false });
			},
			onMouseEnter: () => {
				this.setState({ selected: true });
			},
			ref: null,
			"data-linkid": this.props.link.getID(),
			strokeOpacity: this.state.selected ? 0.1 : 0,
			strokeWidth: 20,
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

	findPathAndRelativePositionToRenderLabel = (index: number): { path: any; position: number } => {
		// an array to hold all path lengths, making sure we hit the DOM only once to fetch this information
		const lengths = this.refPaths.map(path => path.getTotalLength());

		// calculate the point where we want to display the label
		let labelPosition =
			lengths.reduce((previousValue, currentValue) => previousValue + currentValue, 0) *
			(index / (this.props.link.labels.length + 1));

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

	calculateLabelPosition = (label, index: number) => {
		if (!this.refLabels[label.id]) {
			// no label? nothing to do here
			return;
		}

		const { path, position } = this.findPathAndRelativePositionToRenderLabel(index);

		const labelDimensions = {
			width: this.refLabels[label.id].offsetWidth,
			height: this.refLabels[label.id].offsetHeight
		};

		const pathCentre = path.getPointAtLength(position);

		const labelCoordinates = {
			x: pathCentre.x - labelDimensions.width / 2 + label.offsetX,
			y: pathCentre.y - labelDimensions.height / 2 + label.offsetY
		};
		this.refLabels[label.id].setAttribute(
			"style",
			`transform: translate(${labelCoordinates.x}px, ${labelCoordinates.y}px);`
		);
	};

	/**
	 * Smart routing is only applicable when all conditions below are true:
	 * - smart routing is set to true on the engine
	 * - current link is between two nodes (not between a node and an empty point)
	 * - no custom points exist along the line
	 */
	isSmartRoutingApplicable(): boolean {
		const { diagramEngine, link } = this.props;

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
		const { diagramEngine } = this.props;
		if (!diagramEngine.nodesRendered) {
			return null;
		}

		//ensure id is present for all points on the path
		var points = this.props.link.points;
		var paths = [];

		if (this.isSmartRoutingApplicable()) {
			// first step: calculate a direct path between the points being linked
			const directPathCoords = this.pathFinding.calculateDirectPath(_.first(points), _.last(points));

			const routingMatrix = diagramEngine.getRoutingMatrix();
			// now we need to extract, from the routing matrix, the very first walkable points
			// so they can be used as origin and destination of the link to be created
			const smartLink = this.pathFinding.calculateLinkStartEndCoords(routingMatrix, directPathCoords);

			if (smartLink) {
				const { start, end, pathToStart, pathToEnd } = smartLink;

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
							}
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
				var isHorizontal = Math.abs(points[0].x - points[1].x) > Math.abs(points[0].y - points[1].y);
				var xOrY = isHorizontal ? "x" : "y";

				//draw the smoothing
				//if the points are too close, just draw a straight line
				var margin = 50;
				if (Math.abs(points[0][xOrY] - points[1][xOrY]) < 50) {
					margin = 5;
				}

				var pointLeft = points[0];
				var pointRight = points[1];

				//some defensive programming to make sure the smoothing is
				//always in the right direction
				if (pointLeft[xOrY] > pointRight[xOrY]) {
					pointLeft = points[1];
					pointRight = points[0];
				}

				paths.push(
					this.generateLink(
						Toolkit.generateCurvePath(pointLeft, pointRight, this.props.link.curvyness),
						{
							onMouseDown: event => {
								this.addPointToLink(event, 1);
							}
						},
						"0"
					)
				);

				// draw the link as dangeling
				if (this.props.link.targetPort === null) {
					paths.push(this.generatePoint(1));
				}
			} else {
				//draw the multiple anchors and complex line instead
				for (let j = 0; j < points.length - 1; j++) {
					paths.push(
						this.generateLink(
							Toolkit.generateLinePath(points[j], points[j + 1]),
							{
								"data-linkid": this.props.link.id,
								"data-point": j,
								onMouseDown: (event: MouseEvent) => {
									this.addPointToLink(event, j + 1);
								}
							},
							j
						)
					);
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

		this.refPaths = [];
		return (
			<g {...this.getProps()}>
				{paths}
				{_.map(this.props.link.labels, labelModel => {
					return this.generateLabel(labelModel);
				})}
			</g>
		);
	}
}
