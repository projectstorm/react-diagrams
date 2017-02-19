/// <reference types="react" />
import * as React from "react";
import { DiagramEngine } from "../DiagramEngine";
import { BaseModel } from "../Common";
export declare class BaseAction {
    mouseX: number;
    mouseY: number;
    ms: number;
    constructor(mouseX: number, mouseY: number);
}
export interface DiagramProps {
    diagramEngine: DiagramEngine;
}
export interface DiagramState {
    action: BaseAction | null;
    renderedNodes: boolean;
    windowListener: any;
}
/**
 * @author Dylan Vorster
 */
export declare class DiagramWidget extends React.Component<DiagramProps, DiagramState> {
    constructor(props: DiagramProps);
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: DiagramProps): void;
    /**
     * Gets a model and element under the mouse cursor
     */
    getMouseElement(event: any): {
        model: BaseModel;
        element: Element;
    };
    componentDidMount(): void;
    render(): React.DOMElement<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}
