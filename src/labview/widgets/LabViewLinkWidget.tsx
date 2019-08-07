import * as React from "react";
import { DiagramEngine } from "../../DiagramEngine";
import { PointModel } from "../../models/PointModel";
import { Toolkit } from "../../Toolkit";
import { LabViewLinkFactory } from "../factories/LabViewLinkFactory";
import { DefaultLinkModel } from "../../defaults/models/DefaultLinkModel";
import PathFinding from "../../routing/PathFinding";
import * as _ from "lodash";
import { LabelModel } from "../../models/LabelModel";
import { BaseWidget, BaseWidgetProps } from "../../widgets/BaseWidget";

export interface LabViewLinkProps extends BaseWidgetProps {
	color?: string;
	width?: number;
	smooth?: boolean;
	link: DefaultLinkModel;
	diagramEngine: DiagramEngine;
	pointAdded?: (point: PointModel, event: MouseEvent) => any;
}

export interface LabViewLinkState {
	selected: boolean,
	canDrag: boolean,
}

export class LabViewLinkWidget extends BaseWidget<LabViewLinkProps, LabViewLinkState> {
	public static defaultProps: LabViewLinkProps = {
		color: "red",
		width: 3,
		link: null,
		engine: null,
		smooth: false,
		diagramEngine: null
	};

	// DOM references to the label and paths (if label is given), used to calculate dynamic positioning
	refLabels: { [id: string]: HTMLElement };
	refPaths: SVGPathElement[];
	dragging_index: number;

	pathFinding: PathFinding; // only set when smart routing is active

	constructor(props: LabViewLinkProps) {
		super("srd-default-link", props);

		this.refLabels = {};
		this.refPaths = [];
		this.state = {
			selected: false,
			canDrag: false,
		};

		if (props.diagramEngine.isSmartRoutingEnabled()) {
			this.pathFinding = new PathFinding(this.props.diagramEngine);
		}

		this.dragging_index = 0;
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
			(props.diagramEngine.getFactoryForLink(this.props.link) as LabViewLinkFactory).generateLinkSegment(
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

	calculatePositions(points: PointModel[], event: MouseEvent, index: number, coordinate: string) {
		// If path is first or last add another point to keep node port on its position
		if (index === 0) {
			let point = new PointModel(this.props.link, { x: points[index].x, y: points[index].y });
			this.props.link.addPoint(point, index);
			this.dragging_index++;
			return;
		} else if (index === points.length - 2) {
			let point = new PointModel(this.props.link, { x: points[index + 1].x,
				y: points[index + 1].y, });
			this.props.link.addPoint(point, index + 1);
			return;
		}

		// Merge two points if it is not close to node port
		if (index - 2 > 0) {
			if (Math.abs(points[index - 1][coordinate] - points[index + 1][coordinate]) < 5) {
				points[index - 2][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
				points[index + 1][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
				points[index - 1].remove();
				points[index - 1].remove();
				this.dragging_index--;
				this.dragging_index--;
				return;
			}
		}

		// Merge two points if it is not close to node port
		if (index + 2 < points.length - 2) {
			if (Math.abs(points[index + 1][coordinate] - points[index + 2][coordinate]) < 5) {
				points[index][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
				points[index + 3][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
				points[index + 1].remove();
				points[index + 1].remove();
				return;
			}
		}

		// If no condition above handled then just update path points position
		points[index][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
		points[index + 1][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
	}

	draggingEvent(event: MouseEvent, index: number) {
		let points = this.props.link.points;

		// get moving difference. Index + 1 will work because links indexes has
		// length = points.lenght - 1
		let dx = Math.abs(points[index].x - points[index + 1].x);
		let dy = Math.abs(points[index].y - points[index + 1].y);

		// moving with y direction
		if (dx === 0) {
			this.calculatePositions(points, event, index, 'x');
		} else if (dy === 0) {
			this.calculatePositions(points, event, index, 'y');
		}
	}

	handleMove = function (event: MouseEvent) {
		this.draggingEvent(event, this.dragging_index);
	}.bind(this);

	handleUp = function (event: MouseEvent) {
		// Unregister handlers to avoid multiple event handlers for other links
		this.setState({ canDrag: false, selected: false });
		window.removeEventListener('mousemove', this.handleMove);
		window.removeEventListener('mouseup', this.handleUp);
	}.bind(this);

	render() {
		const { diagramEngine } = this.props;
		if (!diagramEngine.nodesRendered) {
			return null;
		}

		//ensure id is present for all points on the path
		let points = this.props.link.points;
		let paths = [];

		// Get points based on link orientation
		let pointLeft = points[0];
		let pointRight = points[points.length - 1];
		if (pointLeft.x > pointRight.x) {
			pointLeft = points[points.length - 1];
			pointRight = points[0];
		}
		let dy = Math.abs(points[0].y - points[points.length - 1].y);

		// When new link add one middle point to get everywhere 90° angle
		if (this.props.link.targetPort === null && points.length === 2) {
			this.props.link.addPoint(new PointModel(this.props.link, { x: pointLeft.x,
				y: pointRight.y, }), 1);

		}
		// When new link is moving and not connected to target port move with middle point
		else if (this.props.link.targetPort === null) {
			points[1].x = pointLeft.x;
			points[1].y = pointRight.y;
		}
		// Render was called but link is not moved but user.
		// Node is moved and in this case fix coordinates to get 90° angle.
		// For loop just for first and last path
		else if (!this.state.canDrag && points.length > 2) {
			for (let i = 1; i < points.length; i+= points.length - 2) {
				let dx = Math.abs(points[i].x - points[i - 1].x);
				let dy = Math.abs(points[i].y - points[i - 1].y);
				if (dx !== 0 && dy !== 0) {
					if (dx < dy) {
						if (i - 1 === 0) { points[i].x = points[i - 1].x; }
						else if (i === points.length - 1) { points[i - 1].x = points[i].x; }
					} else {
						if (i - 1 === 0) {points[i].y = points[i - 1].y;}
						else if (i === points.length - 1) { points[i - 1].y = points[i].y; }
					}
				}
			}
		}

		// If there is existing link which has two points add one
		// NOTE: It doesn't matter if check is for dy or dx
		if (points.length === 2 && dy !== 0 && !this.state.canDrag) {
			this.props.link.addPoint(new PointModel(this.props.link, { x: pointLeft.x,
				y: pointRight.y, }), 1);
		}

		for (let j = 0; j < points.length - 1; j++) {
			paths.push(
				this.generateLink(
					Toolkit.generateLinePath(points[j], points[j + 1]),
					{
						"data-linkid": this.props.link.id,
						"data-point": j,
						onMouseDown: (event: MouseEvent) => {
							if (event.button === 0) {
								this.setState({ canDrag: true });
								this.dragging_index = j;
								// Register mouse move event to track mouse position
								// On mouse up these events are unregistered check "this.handleUp"
								window.addEventListener('mousemove', this.handleMove);
								window.addEventListener('mouseup', this.handleUp);
							}
						}
					},
					j
				)
			);
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
