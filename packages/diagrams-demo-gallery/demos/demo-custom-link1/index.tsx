import createEngine, {
	DiagramModel,
	DefaultNodeModel,
	DefaultPortModel,
	DefaultLinkFactory,
	DefaultLinkModel
} from '@projectstorm/react-diagrams';
import * as React from 'react';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';

export class AdvancedLinkModel extends DefaultLinkModel {
	constructor() {
		super({
			type: 'advanced',
			width: 10
		});
	}
}

export class AdvancedPortModel extends DefaultPortModel {
	createLinkModel(): AdvancedLinkModel | null {
		return new AdvancedLinkModel();
	}
}

export class AdvancedLinkSegment extends React.Component<{ model: AdvancedLinkModel; path: string }> {
	path: SVGPathElement;
	circle: SVGCircleElement;
	callback: () => any;
	percent: number;
	handle: any;
	mounted: boolean;

	constructor(props) {
		super(props);
		this.percent = 0;
	}

	componentDidMount() {
		this.mounted = true;
		this.callback = () => {
			if (!this.circle || !this.path) {
				return;
			}

			this.percent += 2;
			if (this.percent > 100) {
				this.percent = 0;
			}

			let point = this.path.getPointAtLength(this.path.getTotalLength() * (this.percent / 100.0));

			this.circle.setAttribute('cx', '' + point.x);
			this.circle.setAttribute('cy', '' + point.y);

			if (this.mounted) {
				requestAnimationFrame(this.callback);
			}
		};
		requestAnimationFrame(this.callback);
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	render() {
		return (
			<>
				<path
					fill="none"
					ref={ref => {
						this.path = ref;
					}}
					strokeWidth={this.props.model.getOptions().width}
					stroke="rgba(255,0,0,0.5)"
					d={this.props.path}
				/>
				<circle
					ref={ref => {
						this.circle = ref;
					}}
					r={10}
					fill="orange"
				/>
			</>
		);
	}
}

export class AdvancedLinkFactory extends DefaultLinkFactory {
	constructor() {
		super('advanced');
	}

	generateModel(): AdvancedLinkModel {
		return new AdvancedLinkModel();
	}

	generateLinkSegment(model: AdvancedLinkModel, selected: boolean, path: string) {
		return (
			<g>
				<AdvancedLinkSegment model={model} path={path} />
			</g>
		);
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
	let port1 = node1.addPort(new AdvancedPortModel(false, 'out-1', 'Out thick'));
	let port2 = node1.addPort(new DefaultPortModel(false, 'out-2', 'Out default'));
	node1.setPosition(100, 100);

	var node2 = new DefaultNodeModel('Target', 'rgb(192,255,0)');
	var port3 = node2.addPort(new AdvancedPortModel(true, 'in-1', 'In thick'));
	var port4 = node2.addPort(new DefaultPortModel(true, 'in-2', 'In default'));
	node2.setPosition(300, 100);

	var node3 = new DefaultNodeModel('Source', 'rgb(0,192,255)');
	node3.addPort(new AdvancedPortModel(false, 'out-1', 'Out thick'));
	node3.addPort(new DefaultPortModel(false, 'out-2', 'Out default'));
	node3.setPosition(100, 200);

	var node4 = new DefaultNodeModel('Target', 'rgb(192,255,0)');
	node4.addPort(new AdvancedPortModel(true, 'in-1', 'In thick'));
	node4.addPort(new DefaultPortModel(true, 'in-2', 'In default'));
	node4.setPosition(300, 200);

	var model = new DiagramModel();

	model.addAll(port1.link(port3), port2.link(port4));

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
