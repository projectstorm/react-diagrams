import * as React from 'react';
import { DiagramEngine, PointModel } from '@projectstorm/react-diagrams-core';
import { DefaultLinkModel } from './DefaultLinkModel';
import { MouseEvent } from 'react';
export interface DefaultLinkProps {
    link: DefaultLinkModel;
    diagramEngine: DiagramEngine;
    pointAdded?: (point: PointModel, event: MouseEvent) => any;
}
export interface DefaultLinkState {
    selected: boolean;
}
export declare class DefaultLinkWidget extends React.Component<DefaultLinkProps, DefaultLinkState> {
    refPaths: React.RefObject<SVGPathElement>[];
    constructor(props: DefaultLinkProps);
    componentDidUpdate(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    addPointToLink(event: MouseEvent, index: number): void;
    generatePoint(point: PointModel): JSX.Element;
    generateLink(path: string, extraProps: any, id: string | number): JSX.Element;
    render(): JSX.Element;
}
