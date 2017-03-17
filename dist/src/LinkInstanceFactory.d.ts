import { LinkModel } from "./Common";
import { AbstractInstanceFactory } from "./AbstractInstanceFactory";
/**
 * @author Dylan Vorster
 */
export declare class LinkInstanceFactory extends AbstractInstanceFactory<LinkModel> {
    constructor();
    getInstance(): LinkModel;
}
