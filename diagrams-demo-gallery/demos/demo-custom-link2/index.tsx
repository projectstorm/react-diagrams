import createEngine, {
	DiagramModel,
	DefaultNodeModel,
	DefaultPortModel,
	DefaultLinkFactory,
	DefaultLinkModel,
	DefaultLinkWidget
} from '@projectstorm/react-diagrams';
import { LinkWidget, PointModel } from '@projectstorm/react-diagrams-core';
import * as React from 'react';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';
import { MouseEvent } from 'react';
import { DefaultLinkPointWidget, DefaultLinkSegmentWidget } from '@projectstorm/react-diagrams-defaults/dist';
import { DiagramEngine } from '@projectstorm/react-diagrams-core/dist';

export class AdvancedLinkModel extends DefaultLinkModel {
	constructor() {
		super({
			type: 'advanced',
			width: 4
		});
	}
}

export class AdvancedPortModel extends DefaultPortModel {
	createLinkModel(): AdvancedLinkModel | null {
		return new AdvancedLinkModel();
	}
}

const CustomLinkArrowWidget = (props) => {
	const { point, previousPoint } = props;

	const angle =
		90 +
		(Math.atan2(
			point.getPosition().y - previousPoint.getPosition().y,
			point.getPosition().x - previousPoint.getPosition().x
		) *
			180) /
			Math.PI;

	//translate(50, -10),
	return (
		<g className="arrow" transform={'translate(' + point.getPosition().x + ', ' + point.getPosition().y + ')'}>
			<g style={{ transform: 'rotate(' + angle + 'deg)' }}>
				<g transform={'translate(0, -3)'}>
					<polygon
						points="0,10 8,30 -8,30"
						fill={props.color}
						data-id={point.getID()}
						data-linkid={point.getLink().getID()}
					/>
				</g>
			</g>
		</g>
	);
};

export interface AdvancedLinkWWidgetProps {
	link: DefaultLinkModel;
	diagramEngine: DiagramEngine;
	pointAdded?: (point: PointModel, event: MouseEvent) => any;
	renderPoints?: boolean;
	selected?: (event: MouseEvent) => any;
}

export class AdvancedLinkWidget extends React.Component<AdvancedLinkWWidgetProps> {
	generatePoint = (point: PointModel): JSX.Element => {
		return (
			<DefaultLinkPointWidget
				key={point.getID()}
				point={point as any}
				colorSelected={this.props.link.getOptions().selectedColor ?? ''}
				color={this.props.link.getOptions().color}
			/>
		);
	};

	generateLink = (path: string, extraProps: any, id: string | number): JSX.Element => {
		return (
			<DefaultLinkSegmentWidget
				key={`link-${id}`}
				path={path}
				diagramEngine={this.props.diagramEngine}
				factory={this.props.diagramEngine.getFactoryForLink(this.props.link)}
				link={this.props.link}
				extras={extraProps}
			/>
		);
	};

	addPointToLink = (event: MouseEvent, index: number) => {
		if (
			!event.shiftKey &&
			!this.props.link.isLocked() &&
			this.props.link.getPoints().length - 1 <= this.props.diagramEngine.getMaxNumberPointsPerLink()
		) {
			const position = this.props.diagramEngine.getRelativeMousePoint(event);
			const point = this.props.link.point(position.x, position.y, index);
			event.persist();
			event.stopPropagation();
			this.props.diagramEngine.getActionEventBus().fireAction({
				event,
				model: point
			});
		}
	};

	generateArrow(point: PointModel, previousPoint: PointModel): JSX.Element {
		return (
			<CustomLinkArrowWidget
				key={point.getID()}
				point={point as any}
				previousPoint={previousPoint as any}
				colorSelected={this.props.link.getOptions().selectedColor}
				color={this.props.link.getOptions().color}
			/>
		);
	}

	render() {
		//ensure id is present for all points on the path
		var points = this.props.link.getPoints();
		var paths = [];

		//draw the multiple anchors and complex line instead
		for (let j = 0; j < points.length - 1; j++) {
			paths.push(
				this.generateLink(
					LinkWidget.generateLinePath(points[j], points[j + 1]),
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

		if (this.props.link.getTargetPort() !== null) {
			paths.push(this.generateArrow(points[points.length - 1], points[points.length - 2]));
		} else {
			paths.push(this.generatePoint(points[points.length - 1]));
		}

		return <g data-default-link-test={this.props.link.getOptions().testName}>{paths}</g>;
	}
}

export class AdvancedLinkFactory extends DefaultLinkFactory {
	constructor() {
		super('advanced');
	}

	generateModel(): AdvancedLinkModel {
		return new AdvancedLinkModel();
	}

	generateReactWidget(event): JSX.Element {
		return <AdvancedLinkWidget link={event.model} diagramEngine={this.engine} />;
	}
}

/**
 *
 * Simple link styling demo
 *
 * @Author kfrajtak
 */
export default () => {
	//1) setup the diagram engine
	var engine = createEngine();
	engine.getLinkFactories().registerFactory(new AdvancedLinkFactory());

	// create some nodes
	var node1 = new DefaultNodeModel('Source', 'rgb(0,192,255)');
	let port1 = node1.addPort(new AdvancedPortModel(false, 'out'));
	node1.setPosition(100, 100);

	var node2 = new DefaultNodeModel('Target', 'rgb(192,255,0)');
	var port2 = node2.addPort(new AdvancedPortModel(true, 'in'));
	node2.setPosition(500, 350);

	var node3 = new DefaultNodeModel('Source', 'rgb(0,192,255)');
	let port3 = node3.addPort(new AdvancedPortModel(false, 'out'));
	node3.setPosition(100, 500);

	var node4 = new DefaultNodeModel('Target', 'rgb(192,255,0)');
	var port4 = node4.addPort(new AdvancedPortModel(true, 'in'));
	node4.setPosition(500, 450);

	var model = new DiagramModel();

	model.addAll(port1.link(port2), port3.link(port4));

	// add everything else
	model.addAll(node1, node2, node3, node4);

	// load model into engine
	engine.setModel(model);

	// render the diagram!
	return (
		<DemoCanvasWidget>
			<CanvasWidget engine={engine} />
		</DemoCanvasWidget>
	);
};
