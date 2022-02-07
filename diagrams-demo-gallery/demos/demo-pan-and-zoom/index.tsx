import * as React from 'react';
import createEngine, { DiagramModel, DefaultNodeModel } from '@projectstorm/react-diagrams';
import { DemoButton, DemoWorkspaceWidget } from '../helpers/DemoWorkspaceWidget';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';

/**
 * Tests the pan and zoom action, which is intended as a trackpad/mobile
 * alternative to the standard ZoomCanvasAction
 */
class CanvasPanAndZoomToggle extends React.Component<any, any> {
	render() {
		const { engine } = this.props;
		return (
			<DemoCanvasWidget>
				<CanvasWidget engine={engine} />
			</DemoCanvasWidget>
		);
	}
}

export default () => {
	/**
	 * 1) setup the diagram engine
	 * PandAndZoomCanvasAction and ZoomCanvasAction are mutually exclusive
	 * If both are enabled, ZoomCanvasAction will override.
	 */
	var engine = createEngine({
		registerDefaultPanAndZoomCanvasAction: true,
		registerDefaultZoomCanvasAction: false
	});

	//2) setup the diagram model
	var model = new DiagramModel();

	//3-A) create a default node
	var node1 = new DefaultNodeModel('Node 1', 'rgb(0,192,255)');
	var port1 = node1.addOutPort('Out');
	node1.setPosition(100, 100);

	//3-B) create another default node
	var node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
	var port2 = node2.addInPort('In');
	node2.setPosition(400, 100);

	//3-C) link the 2 nodes together
	var link1 = port1.link(port2);

	//4) add the models to the root graph
	model.addAll(node1, node2, link1);

	//5) load model into engine
	engine.setModel(model);

	//6) render the diagram!
	return <CanvasPanAndZoomToggle engine={engine} model={model} />;
};
