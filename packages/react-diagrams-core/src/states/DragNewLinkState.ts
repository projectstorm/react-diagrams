import {
	AbstractDisplacementState,
	AbstractDisplacementStateEvent,
	Action,
	ActionEvent,
	InputType
} from '@projectstorm/react-canvas-core';
import { PortModel } from '../entities/port/PortModel';
import { MouseEvent } from 'react';
import { LinkModel } from '../entities/link/LinkModel';
import { DiagramEngine } from '../DiagramEngine';

export class DragNewLinkState extends AbstractDisplacementState<DiagramEngine> {
	port: PortModel;
	link: LinkModel;

	constructor() {
		super({
			name: 'drag-new-link'
		});
		this.registerAction(
			new Action({
				type: InputType.MOUSE_DOWN,
				fire: (event: ActionEvent<MouseEvent, PortModel>) => {
					this.port = this.engine.getMouseElement(event.event) as PortModel;
					this.link = this.port.createLinkModel();

					// if no link is given, just eject the state
					if (!this.link) {
						this.eject();
						return;
					}
					this.link.setSourcePort(this.port);
					this.engine.getModel().addLink(this.link);
					this.port.reportPosition();
				}
			})
		);
		this.registerAction(
			new Action({
				type: InputType.MOUSE_UP,
				fire: (event: ActionEvent<MouseEvent>) => {
					const model = this.engine.getMouseElement(event.event);

					// check to see if we connected to a new port
					if (model instanceof PortModel) {
						this.link.setTargetPort(model);
						model.reportPosition();
						this.engine.repaintCanvas();
					}
				}
			})
		);
	}

	fireMouseMoved(event: AbstractDisplacementStateEvent): any {
		const pos = this.port.getPosition();
		this.link.getLastPoint().setPosition(pos.x + event.virtualDisplacementX, pos.y + event.virtualDisplacementY);
		this.engine.repaintCanvas();
	}
}
