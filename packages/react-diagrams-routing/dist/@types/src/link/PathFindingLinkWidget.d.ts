import * as React from 'react';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import PathFinding from '../engine/PathFinding';
import { PathFindingLinkFactory } from './PathFindingLinkFactory';
import { PathFindingLinkModel } from './PathFindingLinkModel';
export interface PathFindingLinkWidgetProps {
    color?: string;
    width?: number;
    smooth?: boolean;
    link: PathFindingLinkModel;
    diagramEngine: DiagramEngine;
    factory: PathFindingLinkFactory;
}
export interface PathFindingLinkWidgetState {
    selected: boolean;
}
export declare class PathFindingLinkWidget extends React.Component<PathFindingLinkWidgetProps, PathFindingLinkWidgetState> {
    refPaths: React.RefObject<SVGPathElement>[];
    pathFinding: PathFinding;
    constructor(props: PathFindingLinkWidgetProps);
    componentDidUpdate(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    generateLink(path: string, id: string | number): JSX.Element;
    render(): JSX.Element;
}
