import { BaseEntity, BaseListener } from "./BaseEntity";
/**
 * @author Dylan Vorster
 */
export declare abstract class AbstractInstanceFactory<T extends BaseEntity<BaseListener>> {
    className: string;
    constructor(className: string);
    getName(): string;
    abstract getInstance(): T;
}
