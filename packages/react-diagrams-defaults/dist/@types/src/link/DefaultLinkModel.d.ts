import { LabelModel, LinkModel, LinkModelGenerics, LinkModelListener, PortModel } from '@projectstorm/react-diagrams-core';
import { BaseEntityEvent, BaseModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core';
export interface DefaultLinkModelListener extends LinkModelListener {
    colorChanged?(event: BaseEntityEvent<DefaultLinkModel> & {
        color: null | string;
    }): void;
    widthChanged?(event: BaseEntityEvent<DefaultLinkModel> & {
        width: 0 | number;
    }): void;
}
export interface DefaultLinkModelOptions extends BaseModelOptions {
    width?: number;
    color?: string;
    selectedColor?: string;
    curvyness?: number;
    type?: string;
    testName?: string;
}
export interface DefaultLinkModelGenerics extends LinkModelGenerics {
    LISTENER: DefaultLinkModelListener;
    OPTIONS: DefaultLinkModelOptions;
}
export declare class DefaultLinkModel extends LinkModel<DefaultLinkModelGenerics> {
    constructor(options?: DefaultLinkModelOptions);
    calculateControlOffset(port: PortModel): [number, number];
    getSVGPath(): string;
    serialize(): {
        width: number;
        color: string;
        curvyness: number;
        selectedColor: string;
        source: string;
        sourcePort: string;
        target: string;
        targetPort: string;
        points: {
            x: number;
            y: number;
            type: string;
            selected: boolean;
            extras: any;
            id: string;
            locked: boolean;
        }[];
        labels: {
            offsetX: number;
            offsetY: number;
            type: string;
            selected: boolean;
            extras: any;
            id: string;
            locked: boolean;
        }[];
        type: string;
        selected: boolean;
        extras: any;
        id: string;
        locked: boolean;
    };
    deserialize(event: DeserializeEvent<this>): void;
    addLabel(label: LabelModel | string): void;
    setWidth(width: number): void;
    setColor(color: string): void;
}
