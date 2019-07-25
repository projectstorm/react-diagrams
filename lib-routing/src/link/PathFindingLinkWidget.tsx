import * as React from 'react';
import * as _ from 'lodash';
import { BaseWidget, BaseWidgetProps, DiagramEngine, LabelModel, PointModel } from '@projectstorm/react-diagrams-core';
import PathFinding from '../engine/PathFinding';
import { PathFindingLinkFactory } from './PathFindingLinkFactory';
import { PathFindingLinkModel } from './PathFindingLinkModel';

export interface PathFindingLinkWidgetProps extends BaseWidgetProps {
	color?: string;
	width?: number;
	smooth?: boolean;
	link: PathFindingLinkModel;
	diagramEngine: DiagramEngine;
	factory: PathFindingLinkFactory;
	pointAdded?: (point: PointModel, event: MouseEvent) => any;
}

export interface PathFindingLinkWidgetState {
	selected: boolean;
}

export class PathFindingLinkWidget extends BaseWidget<PathFindingLinkWidgetProps, PathFindingLinkWidgetState> {
	public static defaultProps: PathFindingLinkWidgetProps = {
		color: 'black',
		width: 3,
		link: null,
		engine: null,
		factory: null,
		smooth: false,
		diagramEngine: null
	};

	// DOM references to the label and paths (if label is given), used to calculate dynamic positioning
	refLabels: { [id: string]: HTMLElement };
	refPaths: SVGPathElement[];

	pathFinding: PathFinding; // only set when smart routing is active

	constructor(props: PathFindingLinkWidgetProps) {
		super('srd-default-link', props);

		this.refLabels = {};
		this.refPaths = [];
		this.state = {
			selected: false
		};
		this.pathFinding = new PathFinding(this.props.factory);
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

	generatePoint(pointIndex: number): JSX.Element {
		let x = this.props.link.points[pointIndex].x;
		let y = this.props.link.points[pointIndex].y;

		return (
			<g key={'point-' + this.props.link.points[pointIndex].getID()}>
				<circle
					cx={x}
					cy={y}
					r={5}
					className={
						'point ' +
						this.bem('__point') +
						(this.props.link.points[pointIndex].isSelected() ? this.bem('--point-selected') : '')
					}
				/>
				<circle
					onMouseLeave={() => {
						this.setState({ selected: false });
					}}
					onMouseEnter={() => {
						this.setState({ selected: true });
					}}
					data-id={this.props.link.points[pointIndex].getID()}
					data-linkid={this.props.link.getID()}
					cx={x}
					cy={y}
					r={15}
					opacity={0}
					className={'point ' + this.bem('__point')}
				/>
			</g>
		);
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

	generateLabel(label: LabelModel) {
		const canvas = this.props.diagramEngine.canvas as HTMLElement;
		return (
			<foreignObject
				key={label.getID()}
				className={this.bem('__label')}
				width={canvas.offsetWidth}
				height={canvas.offsetHeight}>
				<div ref={ref => (this.refLabels[label.getID()] = ref)}>
					{this.props.diagramEngine.getFactoryForLabel(label).generateReactWidget({model: label})}
				</div>
			</foreignObject>
		);
	}

	generateLink(path: string, extraProps: any, id: string | number): JSX.Element {
		let Bottom = (
			<path
				className={this.state.selected ? this.bem('--path-selected') : ''}
				strokeWidth={this.props.width}
				stroke={this.props.color}
				ref={ref => ref && this.refPaths.push(ref)}
				d={path}
			/>
		);

		var Top = React.cloneElement(Bottom, {
			...extraProps,
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
			'style',
			`transform: translate(${labelCoordinates.x}px, ${labelCoordinates.y}px);`
		);
	};

	render() {
		const { diagramEngine } = this.props;
		if (!diagramEngine.nodesRendered) {
			return null;
		}

		//ensure id is present for all points on the path
		var points = this.props.link.points;
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
				this.generateLink(
					this.props.factory.generateDynamicPath(simplifiedPath),
					{
						onMouseDown: event => {
							this.addPointToLink(event, 1);
						}
					},
					'0'
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
