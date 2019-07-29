import * as React from 'react';
import { BaseWidget, BaseWidgetProps, DiagramEngine, PointModel, Toolkit } from '@projectstorm/react-diagrams-core';
import { DefaultLinkModel } from './DefaultLinkModel';
import { DefaultLinkFactory } from './DefaultLinkFactory';
import { DefaultLinkPointWidget } from './DefaultLinkPointWidget';

export interface DefaultLinkProps extends BaseWidgetProps {
	color?: string;
	colorSelected?: string;

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
	// DOM references to the label and paths (if label is given), used to calculate dynamic positioning
	refLabels: { [id: string]: HTMLElement };
	refPaths: SVGPathElement[];

	constructor(props: DefaultLinkProps) {
		super('srd-default-link', props);

		this.refLabels = {};
		this.refPaths = [];
		this.state = {
			selected: false
		};
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

	addPointToLink = (event: MouseEvent, index: number): void => {
		if (
			!event.shiftKey &&
			!this.props.diagramEngine.isModelLocked(this.props.link) &&
			this.props.link.getPoints().length - 1 <= this.props.diagramEngine.getMaxNumberPointsPerLink()
		) {
			const point = new PointModel({
				link: this.props.link,
				position: this.props.diagramEngine.getRelativeMousePoint(event)
			});
			this.props.link.addPoint(point, index);
			this.forceUpdate();
			this.props.pointAdded(point, event);
		}
	};

	generatePoint(point: PointModel): JSX.Element {
		return (
			<DefaultLinkPointWidget
				key={point.getID()}
				point={point as any}
				colorSelected={this.props.colorSelected}
				color={this.props.color}
			/>
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

		if (points.length === 2) {
			paths.push(
				this.generateLink(
					this.props.link.getSVGPath(),
					{
						onMouseDown: event => {
							this.addPointToLink(event, 1);
						}
					},
					'0'
				)
			);

			// draw the link as dangeling
			if (this.props.link.getTargetPort() == null) {
				paths.push(this.generatePoint(points[1]));
			}
		} else {
			//draw the multiple anchors and complex line instead
			for (let j = 0; j < points.length - 1; j++) {
				paths.push(
					this.generateLink(
						Toolkit.generateLinePath(points[j], points[j + 1]),
						{
							'data-linkid': this.props.link.getID(),
							'data-point': j,
							onMouseDown: (event: MouseEvent) => {
								this.addPointToLink(event, j + 1);
							}
						},
						j
					)
				);
			}

			//render the circles
			for (let i = 1; i < points.length - 1; i++) {
				paths.push(this.generatePoint(points[i]));
			}

			if (this.props.link.getTargetPort() == null) {
				paths.push(this.generatePoint(points[points.length - 1]));
			}
		}

		this.refPaths = [];
		return paths;
	}
}
