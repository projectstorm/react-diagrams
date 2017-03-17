/// <reference types="react" />
import * as React from "react";
import { LinkModel, PointModel } from "../Common";
import { DiagramEngine } from "../DiagramEngine";
export interface DefaultLinkProps {
    color?: string;
    width?: number;
    link: LinkModel;
    smooth?: boolean;
    diagramEngine: DiagramEngine;
    pointAdded?: (point: PointModel, event) => any;
}
export interface DefaultLinkState {
    selected: boolean;
}
/**
 * @author Dylan Vorster
 */
export declare class DefaultLinkWidget extends React.Component<DefaultLinkProps, DefaultLinkState> {
    static defaultProps: DefaultLinkProps;
    constructor(props: DefaultLinkProps);
    generatePoint(pointIndex: number): JSX.Element;
    generateLink(extraProps: {
        id: number;
    }): JSX.Element;
    render(): React.DOMElement<React.SVGAttributes<SVGElement>, SVGElement>;
}
