import * as SRD from "../../src/main";
export declare class DiamondPortModel extends SRD.PortModel {
    position: string | 'top' | 'bottom' | 'left' | 'right';
    constructor(pos?: string);
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
        position: string;
    };
    deSerialize(data: any): void;
}
