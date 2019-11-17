import * as React from 'react';
import { DiagramEngine, LinkWidget, PointModel } from '@projectstorm/react-diagrams-core';
import { RightAngleLinkFactory } from './RightAngleLinkFactory';
import { DefaultLinkModel, DefaultLinkSegmentWidget } from '@projectstorm/react-diagrams-defaults';
import { Point } from '@projectstorm/geometry';
import { MouseEvent } from 'react';
import { RightAngleLinkModel } from './RightAngleLinkModel';

export interface RightAngleLinkProps {
	color?: string;
	width?: number;
	smooth?: boolean;
	link: RightAngleLinkModel;
	diagramEngine: DiagramEngine;
	factory: RightAngleLinkFactory;
}

export interface RightAngleLinkState {
	selected: boolean;
	canDrag: boolean;
}

export class RightAngleLinkWidget extends React.Component<RightAngleLinkProps, RightAngleLinkState> {
	public static defaultProps: RightAngleLinkProps = {
		color: 'red',
		width: 3,
		link: null,
		smooth: false,
		diagramEngine: null,
		factory: null
	};

	refPaths: React.RefObject<SVGPathElement>[];

	// DOM references to the label and paths (if label is given), used to calculate dynamic positioning
	refLabels: { [id: string]: HTMLElement };
	dragging_index: number;

	constructor(props: RightAngleLinkProps) {
		super(props);

		this.refPaths = [];
		this.state = {
			selected: false,
			canDrag: false
		};

		this.dragging_index = 0;
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

	generateLink(path: string, extraProps: any, id: string | number): JSX.Element {
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
				extras={extraProps}
			/>
		);
	}

	calculatePositions(points: PointModel[], event: MouseEvent, index: number, coordinate: string) {
		// If path is first or last add another point to keep node port on its position
		if (index === 0) {
			let point = new PointModel({
				link: this.props.link,
				position: new Point(points[index].getX(), points[index].getY())
			});
			this.props.link.addPoint(point, index);
			this.dragging_index++;
			return;
		} else if (index === points.length - 2) {
			let point = new PointModel({
				link: this.props.link,
				position: new Point(points[index + 1].getX(), points[index + 1].getY())
			});
			this.props.link.addPoint(point, index + 1);
			return;
		}

		// Merge two points if it is not close to node port and close to each other
		if (index - 2 > 0) {
			let _points = {
				[index - 2]: points[index - 2].getPosition(),
				[index + 1]: points[index + 1].getPosition(),
				[index - 1]: points[index - 1].getPosition()
			};
			if (Math.abs(_points[index - 1][coordinate] - _points[index + 1][coordinate]) < 5) {
				_points[index - 2][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
				_points[index + 1][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
				points[index - 2].setPosition(_points[index - 2]);
				points[index + 1].setPosition(_points[index + 1]);
				points[index - 1].remove();
				points[index - 1].remove();
				this.dragging_index--;
				this.dragging_index--;
				return;
			}
		}

		// Merge two points if it is not close to node port
		if (index + 2 < points.length - 2) {
			let _points = {
				[index + 3]: points[index + 3].getPosition(),
				[index + 2]: points[index + 2].getPosition(),
				[index + 1]: points[index + 1].getPosition(),
				[index]: points[index].getPosition()
			};
			if (Math.abs(_points[index + 1][coordinate] - _points[index + 2][coordinate]) < 5) {
				_points[index][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
				_points[index + 3][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
				points[index].setPosition(_points[index]);
				points[index + 3].setPosition(_points[index + 3]);
				points[index + 1].remove();
				points[index + 1].remove();
				return;
			}
		}

		// If no condition above handled then just update path points position
		let _points = {
			[index]: points[index].getPosition(),
			[index + 1]: points[index + 1].getPosition()
		};
		_points[index][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
		_points[index + 1][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
		points[index].setPosition(_points[index]);
		points[index + 1].setPosition(_points[index + 1]);
	}

	draggingEvent(event: MouseEvent, index: number) {
		let points = this.props.link.getPoints();
		// get moving difference. Index + 1 will work because links indexes has
		// length = points.lenght - 1
		let dx = Math.abs(points[index].getX() - points[index + 1].getX());
		let dy = Math.abs(points[index].getY() - points[index + 1].getY());

		// moving with y direction
		if (dx === 0) {
			this.calculatePositions(points, event, index, 'x');
		} else if (dy === 0) {
			this.calculatePositions(points, event, index, 'y');
		}
		this.props.link.setFirstAndLastPathsDirection();
	}

	handleMove = function(event: MouseEvent) {
		this.draggingEvent(event, this.dragging_index);
	}.bind(this);

	handleUp = function(event: MouseEvent) {
		// Unregister handlers to avoid multiple event handlers for other links
		this.setState({ canDrag: false, selected: false });
		window.removeEventListener('mousemove', this.handleMove);
		window.removeEventListener('mouseup', this.handleUp);
	}.bind(this);

	render() {
		//ensure id is present for all points on the path
		let points = this.props.link.getPoints();
		let paths = [];

		// Get points based on link orientation
		let pointLeft = points[0];
		let pointRight = points[points.length - 1];
		let hadToSwitch = false;
		if (pointLeft.getX() > pointRight.getX()) {
			pointLeft = points[points.length - 1];
			pointRight = points[0];
			hadToSwitch = true;
		}
		let dy = Math.abs(points[0].getY() - points[points.length - 1].getY());

		// When new link add one middle point to get everywhere 90° angle
		if (this.props.link.getTargetPort() === null && points.length === 2) {
			[...Array(2)].forEach(item => {
				this.props.link.addPoint(
					new PointModel({
						link: this.props.link,
						position: new Point(pointLeft.getX(), pointRight.getY())
					}),
					1
				);
			});
			this.props.link.setManuallyFirstAndLastPathsDirection(true, true);
		}
		// When new link is moving and not connected to target port move with middle point
		// TODO: @DanielLazarLDAPPS This will be better to update in DragNewLinkState
		//  in function fireMouseMoved to avoid calling this unexpectedly e.g. after Deserialize
		else if (this.props.link.getTargetPort() === null && this.props.link.getSourcePort() !== null) {
			points[1].setPosition(
				pointRight.getX() + (pointLeft.getX() - pointRight.getX()) / 2,
				!hadToSwitch ? pointLeft.getY() : pointRight.getY()
			);
			points[2].setPosition(
				pointRight.getX() + (pointLeft.getX() - pointRight.getX()) / 2,
				!hadToSwitch ? pointRight.getY() : pointLeft.getY()
			);
		}
		// Render was called but link is not moved but user.
		// Node is moved and in this case fix coordinates to get 90° angle.
		// For loop just for first and last path
		else if (!this.state.canDrag && points.length > 2) {
			// Those points and its position only will be moved
			for (let i = 1; i < points.length; i += points.length - 2) {
				if (i - 1 === 0) {
					if (this.props.link.getFirstPathXdirection()) {
						points[i].setPosition(points[i].getX(), points[i - 1].getY());
					} else {
						points[i].setPosition(points[i - 1].getX(), points[i].getY());
					}
				} else {
					if (this.props.link.getLastPathXdirection()) {
						points[i - 1].setPosition(points[i - 1].getX(), points[i].getY());
					} else {
						points[i - 1].setPosition(points[i].getX(), points[i - 1].getY());
					}
				}
			}
		}

		// If there is existing link which has two points add one
		// NOTE: It doesn't matter if check is for dy or dx
		if (points.length === 2 && dy !== 0 && !this.state.canDrag) {
			this.props.link.addPoint(
				new PointModel({
					link: this.props.link,
					position: new Point(pointLeft.getX(), pointRight.getY())
				})
			);
		}

		for (let j = 0; j < points.length - 1; j++) {
			paths.push(
				this.generateLink(
					LinkWidget.generateLinePath(points[j], points[j + 1]),
					{
						'data-linkid': this.props.link.getID(),
						'data-point': j,
						onMouseDown: (event: MouseEvent) => {
							if (event.button === 0) {
								this.setState({ canDrag: true });
								this.dragging_index = j;
								// Register mouse move event to track mouse position
								// On mouse up these events are unregistered check "this.handleUp"
								window.addEventListener('mousemove', this.handleMove);
								window.addEventListener('mouseup', this.handleUp);
							}
						},
						onMouseEnter: (event: MouseEvent) => {
							this.setState({ selected: true });
							this.props.link.lastHoverIndexOfPath = j;
						}
					},
					j
				)
			);
		}

		this.refPaths = [];
		return <g data-default-link-test={this.props.link.getOptions().testName}>{paths}</g>;
	}
}
