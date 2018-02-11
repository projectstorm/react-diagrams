import * as React from "react";
import {DiagramEngine} from "../../DiagramEngine";
import {LinkModel} from "../../models/LinkModel";
import {PointModel} from "../../models/PointModel";
import {Toolkit} from "../../Toolkit";
import {DefaultLinkFactory} from "../factories/DefaultLinkFactory";
import {DefaultLinkModel} from "../models/DefaultLinkModel";

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

	constructor(props: DefaultLinkProps) {
		super(props);
		this.state = {
			selected: false
		};
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

	generateLink(smooth: boolean, extraProps: any, id: string | number, firstPoint: PointModel, lastPoint: PointModel): JSX.Element {
		var props = this.props;

		var Bottom = (props.diagramEngine.getFactoryForLink(this.props.link) as DefaultLinkFactory)
			.generateLinkSegment(this.props.diagramEngine, this.props.link, this.state.selected || this.props.link.isSelected(), firstPoint, lastPoint, smooth);

		var Top = (
			<path
				strokeLinecap="round"
				onMouseLeave={() => {
					this.setState({selected: false});
				}}
				onMouseEnter={() => {
					this.setState({selected: true});
				}}
				data-linkid={this.props.link.getID()}
				stroke={props.color}
				strokeOpacity={this.state.selected ? 0.1 : 0}
				strokeWidth={20}
				onContextMenu={() => {
					if (!this.props.diagramEngine.isModelLocked(this.props.link)) {
						event.preventDefault();
						this.props.link.remove();
					}
				}}
				d={smooth ? Toolkit.generateCurvePath(firstPoint, lastPoint, this.props.link.curvyness) : Toolkit.generateLinePath(firstPoint, lastPoint)}
				{...extraProps}
			/>
		);

		return (
			<g key={"link-" + id}>
				{Bottom}
				{Top}
			</g>
		);
	}

	findPathAndRelativePositionToRenderLabel = (): {  path: any; position: number; } => {
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

	render() {
		//ensure id is present for all points on the path
		var points = this.props.link.points;
		var paths = [];

		//draw the smoothing
		if (points.length === 2) {
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
					true,
					{
						onMouseDown: event => {
							this.addPointToLink(event, 1);
						},
					},
					"0",
					pointLeft, pointRight
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
					false,
					{
						"data-linkid": this.props.link.id,
						"data-point": i,
						onMouseDown: (event: MouseEvent) => {
							this.addPointToLink(event, i + 1);
						},
					},
					i,
					points[i],
					points[i + 1]
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
