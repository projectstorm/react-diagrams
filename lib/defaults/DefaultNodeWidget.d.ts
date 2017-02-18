/// <reference types="react" />
import * as React from "react";
import { NodeModel } from "../Common";
export interface DefaultNodeProps {
    name?: string;
    node: NodeModel;
    inPorts?: (string | {
        name: string;
        display: string;
    })[];
    outPorts?: (string | {
        name: string;
        display: string;
    })[];
    color?: string;
}
export interface DefaultNodeState {
}
/**
 * @author Dylan Vorster
 */
export declare class DefaultNodeWidget extends React.Component<DefaultNodeProps, DefaultNodeState> {
    static defaultProps: DefaultNodeProps;
    constructor(props: DefaultNodeProps);
    render(): React.DOMElement<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}
