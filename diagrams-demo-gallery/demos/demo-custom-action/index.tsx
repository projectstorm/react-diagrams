import * as React from 'react';
import * as _ from 'lodash';
import createEngine, { DiagramModel, DefaultNodeModel, DefaultLinkModel } from '@projectstorm/react-diagrams';
import { CanvasWidget, Action, ActionEvent, InputType } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';


/**
 * Deletes all selected items, but asks for confirmation first
 */
class CustomDeleteItemsAction extends Action {
	constructor() {
		super({
			type: InputType.KEY_DOWN,
			fire: (event: ActionEvent<React.KeyboardEvent>) => {
				if (event.event.code === 'Delete') {
					const selectedEntities = this.engine.getModel().getSelectedEntities();
					if (selectedEntities.length > 0) {
						const confirm = window.confirm('Are you sure you want to delete?');

						if (confirm) {
							_.forEach(selectedEntities, (model) => {
								// only delete items which are not locked
								if (!model.isLocked()) {
									model.remove();
								}
							});
							this.engine.repaintCanvas();
						}
					}
				}
			}
		});
	}
}

export default () => {
	// create an engine without registering DeleteItemsAction
	const engine = createEngine({ registerDefaultDeleteItemsAction: false });
	const model = new DiagramModel();

	const node1 = new DefaultNodeModel({ name: 'Node 1', color: 'rgb(0,192,255)' });
	node1.setPosition(100, 100);
	const port1 = node1.addOutPort('Out');

	const node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
	const port2 = node2.addInPort('In');
	node2.setPosition(400, 100);

	const link1 = port1.link<DefaultLinkModel>(port2);
	link1.getOptions().testName = 'Test';
	link1.addLabel('Hello World!');

	model.addAll(node1, node2, link1);

	engine.setModel(model);

	// register an DeleteItemsAction with custom keyCodes (in this case, only Delete key)
	engine.getActionEventBus().registerAction(new CustomDeleteItemsAction());

	return (
		<DemoCanvasWidget>
			<CanvasWidget engine={engine} />
		</DemoCanvasWidget>
	);
};
