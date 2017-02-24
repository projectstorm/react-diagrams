import { NodeModel } from "../Common";
import { DefaultPortModel } from "./DefaultPortModel";
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
    getInPorts(): DefaultPortModel[];
    getOutPorts(): DefaultPortModel[];
}
