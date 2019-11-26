import {
	AbstractDisplacementState,
	AbstractDisplacementStateEvent,
	Action,
	ActionEvent,
	InputType
} from '@projectstorm/react-canvas-core';
import { PortModel } from '../entities/port/PortModel';
import { MouseEvent, TouchEvent } from 'react';
import { LinkModel } from '../entities/link/LinkModel';
import { DiagramEngine } from '../DiagramEngine';

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

	constructor(options: DragNewLinkStateOptions = {}) {
		super({ name: 'drag-new-link' });

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
				}
			})
		);

		this.registerAction(
			new Action({
				type: InputType.TOUCH_START,
				fire: (event: ActionEvent<TouchEvent, PortModel>) => {
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

					if (this.isNearbySourcePort(event.event) || !this.config.allowLooseLinks) {
						this.link.remove();
						this.engine.repaintCanvas();
					}
				}
			})
		);

		this.registerAction(
			new Action({
				type: InputType.TOUCH_END,
				fire: (event: ActionEvent<TouchEvent>) => {
					const model = this.engine.getMouseElement(event.event);
					console.log(model);
					// check to see if we connected to a new port
					if (model instanceof PortModel) {
						console.log('linking?');
						if (this.port.canLinkToPort(model)) {
							console.log('linking !');
							this.link.setTargetPort(model);
							model.reportPosition();
							this.engine.repaintCanvas();
							return;
						}
					}

					if (this.isNearbySourcePort(event.event) || !this.config.allowLooseLinks) {
						this.link.remove();
						this.engine.repaintCanvas();
					}
				}
			})
		);
	}

	/**
	 * Checks whether the mouse event appears to happen in proximity of the link's source port
	 * @param event
	 */
	isNearbySourcePort(event: MouseEvent | TouchEvent): boolean {
		// @ts-ignore
		const sourcePort = this.link.getSourcePort();
		const sourcePortPosition = this.link.getSourcePort().getPosition();

		if (event.touches && event.touches[0]) {
			return (
				event.touches[0].clientX >= sourcePortPosition.x &&
				event.touches[0].clientX <= sourcePortPosition.x + sourcePort.width &&
				(event.touches[0].clientY >= sourcePortPosition.y &&
					event.touches[0].clientY <= sourcePortPosition.y + sourcePort.height)
			);
		} else {
			return (
				event.clientX >= sourcePortPosition.x &&
				event.clientX <= sourcePortPosition.x + sourcePort.width &&
				(event.clientY >= sourcePortPosition.y && event.clientY <= sourcePortPosition.y + sourcePort.height)
			);
		}
	}

	/**
	 * Calculates the link's far-end point position on mouse move.
	 * In order to be as precise as possible the mouse initialXRelative & initialYRelative are taken into account as well
	 * as the possible engine offset
	 */
	fireMouseMoved(event: AbstractDisplacementStateEvent): any {
		const portPos = this.port.getPosition();
		const zoomLevelPercentage = this.engine.getModel().getZoomLevel() / 100;
		const engineOffsetX = this.engine.getModel().getOffsetX() / zoomLevelPercentage;
		const engineOffsetY = this.engine.getModel().getOffsetY() / zoomLevelPercentage;
		const initialXRelative = this.initialXRelative / zoomLevelPercentage;
		const initialYRelative = this.initialYRelative / zoomLevelPercentage;
		const linkNextX = portPos.x - engineOffsetX + (initialXRelative - portPos.x) + event.virtualDisplacementX;
		const linkNextY = portPos.y - engineOffsetY + (initialYRelative - portPos.y) + event.virtualDisplacementY;

		this.link.getLastPoint().setPosition(linkNextX, linkNextY);
		this.engine.repaintCanvas();
	}
}
