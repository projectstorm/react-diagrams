import { PortModel } from "../Common";
/**
 * @author Dylan Vorster
 */
export declare class DefaultPortModel extends PortModel {
    in: boolean;
    label: string;
    constructor(isInput: boolean, name: string, label?: string);
    serialize(): {
        id: string;
    } & {
        _class: string;
        selected: boolean;
    } & {
        name: string;
        parentNode: string;
        links: string[];
    } & {
        in: boolean;
        label: string;
    };
}
