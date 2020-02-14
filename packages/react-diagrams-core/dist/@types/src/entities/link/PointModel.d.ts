import { LinkModel } from './LinkModel';
import { BaseModelListener, BasePositionModel, BasePositionModelGenerics, BasePositionModelOptions } from '@projectstorm/react-canvas-core';
export interface PointModelOptions extends Omit<BasePositionModelOptions, 'type'> {
    link: LinkModel;
}
export interface PointModelGenerics {
    PARENT: LinkModel;
    OPTIONS: PointModelOptions;
    LISTENER: BaseModelListener;
}
export declare class PointModel<G extends PointModelGenerics = PointModelGenerics> extends BasePositionModel<G & BasePositionModelGenerics> {
    constructor(options: G['OPTIONS']);
    isConnectedToPort(): boolean;
    getLink(): LinkModel;
    remove(): void;
    isLocked(): boolean;
}
