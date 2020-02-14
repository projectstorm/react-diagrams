import * as React from 'react';
import { DiagramEngine, PointModel } from '@projectstorm/react-diagrams-core';
import { RightAngleLinkFactory } from './RightAngleLinkFactory';
import { MouseEvent } from 'react';
import { RightAngleLinkModel } from './RightAngleLinkModel';
export interface RightAngleLinkProps {
    color?: string;
    width?: number;
    smooth?: boolean;
    link: RightAngleLinkModel;
    diagramEngine: DiagramEngine;
    factory: RightAngleLinkFactory;
}
export interface RightAngleLinkState {
    selected: boolean;
    canDrag: boolean;
}
export declare class RightAngleLinkWidget extends React.Component<RightAngleLinkProps, RightAngleLinkState> {
    static defaultProps: RightAngleLinkProps;
    refPaths: React.RefObject<SVGPathElement>[];
    refLabels: {
        [id: string]: HTMLElement;
    };
    dragging_index: number;
    constructor(props: RightAngleLinkProps);
    componentDidUpdate(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    generateLink(path: string, extraProps: any, id: string | number): JSX.Element;
    calculatePositions(points: PointModel[], event: MouseEvent, index: number, coordinate: string): void;
    draggingEvent(event: MouseEvent, index: number): void;
    handleMove: any;
    handleUp: any;
    render(): JSX.Element;
}
