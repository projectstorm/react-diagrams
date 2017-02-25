/// <reference types="react" />
import * as React from "react";
import { DiagramEngine } from "../DiagramEngine";
import { PointModel } from "../Common";
export interface LinkLayerProps {
    diagramEngine: DiagramEngine;
    pointAdded: (point: PointModel, event) => any;
}
export interface LinkLayerState {
}
/**
 * @author Dylan Vorster
 */
export declare class LinkLayerWidget extends React.Component<LinkLayerProps, LinkLayerState> {
    constructor(props: LinkLayerProps);
    render(): React.DOMElement<React.SVGAttributes<SVGElement>, SVGElement>;
}
