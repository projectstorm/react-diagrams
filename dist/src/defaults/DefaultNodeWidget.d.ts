/// <reference types="react" />
import * as React from "react";
import { DefaultNodeModel } from "./DefaultNodeModel";
import { DiagramEngine } from "../DiagramEngine";
export interface DefaultNodeProps {
    node: DefaultNodeModel;
    diagramEngine: DiagramEngine;
}
export interface DefaultNodeState {
}
/**
 * @author Dylan Vorster
 */
export declare class DefaultNodeWidget extends React.Component<DefaultNodeProps, DefaultNodeState> {
    constructor(props: DefaultNodeProps);
    render(): React.DOMElement<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}
