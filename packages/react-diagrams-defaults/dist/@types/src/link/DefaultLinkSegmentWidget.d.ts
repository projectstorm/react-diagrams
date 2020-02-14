import * as React from 'react';
import { DefaultLinkFactory } from './DefaultLinkFactory';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { DefaultLinkModel } from './DefaultLinkModel';
export interface DefaultLinkSegmentWidgetProps {
    path: string;
    link: DefaultLinkModel;
    selected: boolean;
    forwardRef: React.RefObject<SVGPathElement>;
    factory: DefaultLinkFactory;
    diagramEngine: DiagramEngine;
    onSelection: (selected: boolean) => any;
    extras: object;
}
export declare class DefaultLinkSegmentWidget extends React.Component<DefaultLinkSegmentWidgetProps> {
    render(): JSX.Element;
}
