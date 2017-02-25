import { NodeModel } from "../Common";
import { DefaultPortModel } from "./DefaultPortModel";
import { AbstractInstanceFactory } from "../AbstractInstanceFactory";
export declare class DefaultNodeInstanceFactory extends AbstractInstanceFactory<DefaultNodeModel> {
    constructor();
    getInstance(): DefaultNodeModel;
}
/**
 * @author Dylan Vorster
 */
export declare class DefaultNodeModel extends NodeModel {
    name: string;
    color: string;
    ports: {
        [s: string]: DefaultPortModel;
    };
    constructor(name?: string, color?: string);
    serialize(): {
        id: string;
    } & {
        _class: string;
        selected: boolean;
    } & {
        type: string;
        x: number;
        y: number;
        extras: {};
        ports: ({
            id: string;
        } & {
            _class: string;
            selected: boolean;
        } & {
            name: string;
            parentNode: string;
            links: string[];
        })[];
    } & {
        name: string;
        color: string;
    };
    getInPorts(): DefaultPortModel[];
    getOutPorts(): DefaultPortModel[];
}
