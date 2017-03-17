import * as SRD from "../../src/main";
import { DiamondNodeModel } from "./DiamondNodeModel";
import { DiamondPortModel } from "./DiamondPortModel";
export declare class DiamondNodeFactory extends SRD.AbstractInstanceFactory<DiamondNodeModel> {
    constructor();
    getInstance(): DiamondNodeModel;
}
export declare class DiamondPortFactory extends SRD.AbstractInstanceFactory<DiamondPortModel> {
    constructor();
    getInstance(): DiamondPortModel;
}
