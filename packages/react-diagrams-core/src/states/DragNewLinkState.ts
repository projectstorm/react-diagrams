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
import { Point } from '@projectstorm/geometry';

export interface DragNewLinkStateOptions {
	/**
	 * If enabled, the links will stay on the canvas if they dont connect to a port
	 * when dragging finishes
	 */
	allowLooseLinks?: boolean;
	/**
	 * If enabled, then a link can still be drawn from the port even if it is locked
	 */
	allowLinksFromLockedPorts?: boolean;
}

export class DragNewLinkState extends AbstractDisplacementState<DiagramEngine> {
	port: PortModel;
	link: LinkModel;
	config: DragNewLinkStateOptions;

	// will contain the mouse x,y position when it starts dragging a new link
	startingPoint: Point;

	constructor(options: DragNewLinkStateOptions = {}) {
		super({
			name: 'drag-new-link'
		});
		this.config = {
			allowLooseLinks: true,
			allowLinksFromLockedPorts: false,
			...options
		};
		this.registerAction(
			new Action({
				type: InputType.MOUSE_DOWN,
				fire: (event: ActionEvent<MouseEvent, PortModel>) => {
					this.port = this.engine.getMouseElement(event.event) as PortModel;
					if (!this.config.allowLinksFromLockedPorts && this.port.isLocked()) {
						this.eject();
						return;
					}
					this.link = this.port.createLinkModel();

					// if no link is given, just eject the state
					if (!this.link) {
						this.eject();
						return;
					}
					this.link.setSelected(true);
					this.link.setSourcePort(this.port);
					this.engine.getModel().addLink(this.link);
					this.port.reportPosition();

					// save the mouse position for further precision in calculating the link's far-end point
					this.startingPoint = new Point(event.event.clientX, event.event.clientY);
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
						if (this.port.canLinkToPort(model)) {
							this.link.setTargetPort(model);
							model.reportPosition();
							this.engine.repaintCanvas();
							return;
						}
					}

					if (!this.config.allowLooseLinks) {
						this.link.remove();
						this.engine.repaintCanvas();
					}

					// clear the starting point
					this.startingPoint = undefined;
				}
			})
		);
	}
	/**
	 * When the mouse moves calculates the link's far-end point position.
	 * In order to be as precise as possible the mouse startingPoint is taken into account.
	 */
	fireMouseMoved(event: AbstractDisplacementStateEvent): any {
		const pos = this.port.getPosition();
		const linkNextPosX = pos.x + (this.startingPoint.x - pos.x) + event.virtualDisplacementX;
		const linkNextPosY = pos.y + (this.startingPoint.y - pos.y) + event.virtualDisplacementY;

		this.link.getLastPoint().setPosition(linkNextPosX, linkNextPosY);
		this.engine.repaintCanvas();
	}
}
