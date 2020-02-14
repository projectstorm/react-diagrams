import * as React from 'react';
import { PortModel } from './PortModel';
import { DiagramEngine } from '../../DiagramEngine';
import { ListenerHandle } from '@projectstorm/react-canvas-core';
export interface PortProps {
    port: PortModel;
    engine: DiagramEngine;
    className?: any;
    style?: any;
}
export declare class PortWidget extends React.Component<PortProps> {
    ref: React.RefObject<HTMLDivElement>;
    engineListenerHandle: ListenerHandle;
    constructor(props: PortProps);
    report(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: Readonly<PortProps>, prevState: any, snapshot?: any): void;
    componentDidMount(): void;
    getExtraProps(): {
        'data-links': string;
    } | {
        'data-links'?: undefined;
    };
    render(): JSX.Element;
}
