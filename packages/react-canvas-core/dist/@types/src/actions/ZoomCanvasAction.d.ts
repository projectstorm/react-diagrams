import { Action } from '../core-actions/Action';
export interface ZoomCanvasActionOptions {
    inverseZoom?: boolean;
}
export declare class ZoomCanvasAction extends Action {
    constructor(options?: ZoomCanvasActionOptions);
}
