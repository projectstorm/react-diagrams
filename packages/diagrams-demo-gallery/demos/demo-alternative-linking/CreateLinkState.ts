import { Action, ActionEvent, InputType, State } from '@projectstorm/react-canvas-core';
import { PortModel, LinkModel, DiagramEngine } from '@projectstorm/react-diagrams-core';
import { MouseEvent, KeyboardEvent } from 'react';

/**
 * This state is controlling the creation of a link.
 */
export class CreateLinkState extends State<DiagramEngine> {
	sourcePort: PortModel;
	link: LinkModel;

	constructor() {
		super({ name: 'create-new-link' });

		this.registerAction(
			new Action({
				type: InputType.MOUSE_UP,
				fire: (actionEvent: ActionEvent<MouseEvent>) => {
					const element = this.engine.getActionEventBus().getModelForEvent(actionEvent);
					const {
						event: { clientX, clientY }
					} = actionEvent;
					const ox = this.engine.getModel().getOffsetX();
					const oy = this.engine.getModel().getOffsetY();

					if (element instanceof PortModel && !this.sourcePort) {
						this.sourcePort = element;

						/* would be cool if link creating could be done somewhat like
                        const link = createLink({
                            sourcePort: this.sourcePort,
                            points: [{ x: clientX, y: clientY }, { x: clientX, y: clientY }]
                        })
                        */
						const link = this.sourcePort.createLinkModel();
						link.setSourcePort(this.sourcePort);
						link.getFirstPoint().setPosition(clientX - ox, clientY - oy);
						link.getLastPoint().setPosition(clientX - ox + 20, clientY - oy + 20);

						this.link = this.engine.getModel().addLink(link);
					} else if (element instanceof PortModel && this.sourcePort && element != this.sourcePort) {
						if (this.sourcePort.canLinkToPort(element)) {
							this.link.setTargetPort(element);
							element.reportPosition();
							this.clearState();
							this.eject();
						}
					} else if (element === this.link.getLastPoint()) {
						this.link.point(clientX - ox, clientY - oy, -1);
					}

					this.engine.repaintCanvas();
				}
			})
		);

		this.registerAction(
			new Action({
				type: InputType.MOUSE_MOVE,
				fire: (actionEvent: ActionEvent<React.MouseEvent>) => {
					if (!this.link) return;
					const { event } = actionEvent;
					this.link.getLastPoint().setPosition(event.clientX, event.clientY);
					this.engine.repaintCanvas();
				}
			})
		);

		this.registerAction(
			new Action({
				type: InputType.KEY_UP,
				fire: (actionEvent: ActionEvent<KeyboardEvent>) => {
					// on esc press remove any started link and pop back to default state
					if (actionEvent.event.keyCode === 27) {
						this.link.remove();
						this.clearState();
						this.eject();
						this.engine.repaintCanvas();
					}
				}
			})
		);
	}

	clearState() {
		this.link = undefined;
		this.sourcePort = undefined;
	}
}
