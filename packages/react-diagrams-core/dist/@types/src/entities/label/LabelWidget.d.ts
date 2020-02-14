import * as React from 'react';
import { DiagramEngine } from '../../DiagramEngine';
import { LabelModel } from './LabelModel';
export interface LabelWidgetProps {
    engine: DiagramEngine;
    label: LabelModel;
    index: number;
}
export declare class LabelWidget extends React.Component<LabelWidgetProps> {
    ref: React.RefObject<HTMLDivElement>;
    constructor(props: LabelWidgetProps);
    componentDidUpdate(): void;
    componentDidMount(): void;
    findPathAndRelativePositionToRenderLabel: (index: number) => {
        path: SVGPathElement;
        position: number;
    };
    calculateLabelPosition: () => void;
    render(): JSX.Element;
}
