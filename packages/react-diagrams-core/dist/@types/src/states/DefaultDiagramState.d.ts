import { State, DragCanvasState } from '@projectstorm/react-canvas-core';
import { DragNewLinkState } from './DragNewLinkState';
import { DiagramEngine } from '../DiagramEngine';
import { DragDiagramItemsState } from './DragDiagramItemsState';
export declare class DefaultDiagramState extends State<DiagramEngine> {
    dragCanvas: DragCanvasState;
    dragNewLink: DragNewLinkState;
    dragItems: DragDiagramItemsState;
    constructor();
}
