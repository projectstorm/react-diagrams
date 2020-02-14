import * as React from 'react';
import { DiagramEngine } from '../../DiagramEngine';
import { LinkModel } from './LinkModel';
import { PointModel } from './PointModel';
import { ListenerHandle } from '@projectstorm/react-canvas-core';
import { PortModel } from '../port/PortModel';
export interface LinkProps {
    link: LinkModel;
    diagramEngine: DiagramEngine;
}
export interface LinkState {
    sourcePort: PortModel;
    targetPort: PortModel;
}
export declare class LinkWidget extends React.Component<LinkProps, LinkState> {
    sourceListener: ListenerHandle;
    targetListener: ListenerHandle;
    constructor(props: any);
    componentWillUnmount(): void;
    static getDerivedStateFromProps(nextProps: LinkProps, prevState: LinkState): LinkState;
    installTarget(): void;
    installSource(): void;
    componentDidUpdate(prevProps: Readonly<LinkProps>, prevState: Readonly<LinkState>, snapshot: any): void;
    static generateLinePath(firstPoint: PointModel, lastPoint: PointModel): string;
    componentDidMount(): void;
    render(): JSX.Element;
}
