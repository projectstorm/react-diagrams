/// <reference types="react" />
import * as React from "react";
import { LinkModel } from "../Common";
import { DiagramEngine } from "../DiagramEngine";
export interface LinkProps {
    link: LinkModel;
    diagramEngine: DiagramEngine;
    children?: any;
}
export interface LinkState {
}
/**
 * @author Dylan Vorster
 */
export declare class LinkWidget extends React.Component<LinkProps, LinkState> {
    constructor(props: LinkProps);
    shouldComponentUpdate(): boolean;
    render(): any;
}
