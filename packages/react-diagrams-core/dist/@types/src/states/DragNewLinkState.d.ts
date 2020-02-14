import { AbstractDisplacementState, AbstractDisplacementStateEvent } from '@projectstorm/react-canvas-core';
import { PortModel } from '../entities/port/PortModel';
import { MouseEvent } from 'react';
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
export declare class DragNewLinkState extends AbstractDisplacementState<DiagramEngine> {
    port: PortModel;
    link: LinkModel;
    config: DragNewLinkStateOptions;
    constructor(options?: DragNewLinkStateOptions);
    /**
     * Checks whether the mouse event appears to happen in proximity of the link's source port
     * @param event
     */
    isNearbySourcePort({ clientX, clientY }: MouseEvent): boolean;
    /**
     * Calculates the link's far-end point position on mouse move.
     * In order to be as precise as possible the mouse initialXRelative & initialYRelative are taken into account as well
     * as the possible engine offset
     */
    fireMouseMoved(event: AbstractDisplacementStateEvent): any;
}
