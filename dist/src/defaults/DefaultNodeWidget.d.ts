/// <reference types="react" />
import * as React from "react";
import { DefaultNodeModel } from "./DefaultNodeModel";
export interface DefaultNodeProps {
    node: DefaultNodeModel;
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
