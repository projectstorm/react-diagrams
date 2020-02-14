import { BaseEvent, BaseListener, BaseObserver } from './BaseObserver';
import { AbstractFactory } from './AbstractFactory';
export interface FactoryBankListener<F extends AbstractFactory = AbstractFactory> extends BaseListener {
    /**
     * Factory as added to rhe bank
     */
    factoryAdded?: (event: BaseEvent & {
        factory: F;
    }) => any;
    /**
     * Factory was removed from the bank
     */
    factoryRemoved?: (event: BaseEvent & {
        factory: F;
    }) => any;
}
/**
 * Store and managed Factories that extend from Abstractfactory
 */
export declare class FactoryBank<F extends AbstractFactory = AbstractFactory, L extends FactoryBankListener<F> = FactoryBankListener<F>> extends BaseObserver<L> {
    protected factories: {
        [type: string]: F;
    };
    constructor();
    getFactories(): F[];
    clearFactories(): void;
    getFactory<T extends F = F>(type: string): T;
    registerFactory(factory: F): void;
    deregisterFactory(type: string): void;
}
