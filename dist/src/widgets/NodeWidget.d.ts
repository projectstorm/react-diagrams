/// <reference types="react" />
import * as React from "react";
import { NodeModel } from "../Common";
import { DiagramEngine } from "../DiagramEngine";
export interface NodeProps {
    node: NodeModel;
    children?: any;
    diagramEngine: DiagramEngine;
}
export interface NodeState {
}
/**
 * @author Dylan Vorster
 */
export declare class NodeWidget extends React.Component<NodeProps, NodeState> {
    constructor(props: NodeProps);
    shouldComponentUpdate(): boolean;
    render(): React.DOMElement<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}
