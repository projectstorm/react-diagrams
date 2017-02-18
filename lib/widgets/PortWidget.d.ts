/// <reference types="react" />
import * as React from "react";
import { NodeModel } from "../Common";
export interface PortProps {
    name: string;
    node: NodeModel;
}
export interface PortState {
    selected: boolean;
}
/**
 * @author Dylan Vorster
 */
export declare class PortWidget extends React.Component<PortProps, PortState> {
    constructor(props: PortProps);
    render(): React.DOMElement<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}
