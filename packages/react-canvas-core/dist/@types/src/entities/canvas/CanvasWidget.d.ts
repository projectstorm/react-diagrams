import * as React from 'react';
import { CanvasEngine } from '../../CanvasEngine';
export interface DiagramProps {
    engine: CanvasEngine;
    className?: string;
}
export declare class CanvasWidget extends React.Component<DiagramProps> {
    ref: React.RefObject<HTMLDivElement>;
    keyUp: any;
    keyDown: any;
    canvasListener: any;
    constructor(props: DiagramProps);
    componentWillUnmount(): void;
    registerCanvas(): void;
    componentDidUpdate(): void;
    componentDidMount(): void;
    render(): JSX.Element;
}
