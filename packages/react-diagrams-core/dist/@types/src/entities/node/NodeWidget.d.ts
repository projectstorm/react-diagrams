import * as React from 'react';
import { DiagramEngine } from '../../DiagramEngine';
import { NodeModel } from './NodeModel';
import { ListenerHandle } from '@projectstorm/react-canvas-core';
export interface NodeProps {
    node: NodeModel;
    children?: any;
    diagramEngine: DiagramEngine;
}
export declare class NodeWidget extends React.Component<NodeProps> {
    ob: any;
    ref: React.RefObject<HTMLDivElement>;
    listener: ListenerHandle;
    constructor(props: NodeProps);
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: Readonly<NodeProps>, prevState: Readonly<any>, snapshot?: any): void;
    installSelectionListener(): void;
    componentDidMount(): void;
    render(): JSX.Element;
}
