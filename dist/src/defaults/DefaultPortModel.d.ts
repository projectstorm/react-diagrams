import { PortModel } from "../Common";
/**
 * @author Dylan Vorster
 */
export declare class DefaultPortModel extends PortModel {
    in: boolean;
    label: string;
    constructor(isInput: boolean, name: string, label?: string);
}
