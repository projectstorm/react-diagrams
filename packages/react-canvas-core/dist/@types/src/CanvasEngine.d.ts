import { CanvasModel } from './entities/canvas/CanvasModel';
import { FactoryBank } from './core/FactoryBank';
import { AbstractReactFactory } from './core/AbstractReactFactory';
import { LayerModel } from './entities/layer/LayerModel';
import { BaseListener, BaseObserver } from './core/BaseObserver';
import { MouseEvent } from 'react';
import { BaseModel } from './core-models/BaseModel';
import { Point } from '@projectstorm/geometry';
import { ActionEventBus } from './core-actions/ActionEventBus';
import { StateMachine } from './core-state/StateMachine';
export interface CanvasEngineListener extends BaseListener {
    canvasReady?(): void;
    repaintCanvas?(): void;
    rendered?(): void;
}
/**
 * Defines the CanvasEngine options
 */
export interface CanvasEngineOptions {
    registerDefaultDeleteItemsAction?: boolean;
    registerDefaultZoomCanvasAction?: boolean;
    /**
     * Defines the debounce wait time in milliseconds if > 0
     */
    repaintDebounceMs?: number;
}
export declare class CanvasEngine<L extends CanvasEngineListener = CanvasEngineListener, M extends CanvasModel = CanvasModel> extends BaseObserver<L> {
    protected model: M;
    protected layerFactories: FactoryBank<AbstractReactFactory<LayerModel>>;
    protected canvas: HTMLDivElement;
    protected eventBus: ActionEventBus;
    protected stateMachine: StateMachine;
    protected options: CanvasEngineOptions;
    constructor(options?: CanvasEngineOptions);
    getStateMachine(): StateMachine;
    getRelativeMousePoint(event: {
        clientX: number;
        clientY: number;
    }): Point;
    getRelativePoint(x: any, y: any): Point;
    registerFactoryBank(factory: FactoryBank): void;
    getActionEventBus(): ActionEventBus;
    getLayerFactories(): FactoryBank<AbstractReactFactory<LayerModel<import("./entities/layer/LayerModel").LayerModelGenerics>, CanvasEngine<CanvasEngineListener, CanvasModel<import("./entities/canvas/CanvasModel").CanvasModelGenerics>>>, import("./core/FactoryBank").FactoryBankListener<AbstractReactFactory<LayerModel<import("./entities/layer/LayerModel").LayerModelGenerics>, CanvasEngine<CanvasEngineListener, CanvasModel<import("./entities/canvas/CanvasModel").CanvasModelGenerics>>>>>;
    getFactoryForLayer<F extends AbstractReactFactory<LayerModel>>(layer: LayerModel | string): AbstractReactFactory<LayerModel<import("./entities/layer/LayerModel").LayerModelGenerics>, CanvasEngine<CanvasEngineListener, CanvasModel<import("./entities/canvas/CanvasModel").CanvasModelGenerics>>>;
    setModel(model: M): void;
    getModel(): M;
    repaintCanvas(promise: true): Promise<any>;
    repaintCanvas(): void;
    setCanvas(canvas?: HTMLDivElement): void;
    getCanvas(): HTMLDivElement;
    getMouseElement(event: MouseEvent): BaseModel;
    zoomToFit(): void;
}
