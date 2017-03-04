/// <reference types="react" />
import * as React from "react";
import { DiamondNodeModel } from "./DiamondNodeModel";
export interface DiamonNodeWidgetProps {
    node: DiamondNodeModel;
    size?: number;
}
export interface DiamonNodeWidgetState {
}
/**
 * @author Dylan Vorster
 */
export declare class DiamonNodeWidget extends React.Component<DiamonNodeWidgetProps, DiamonNodeWidgetState> {
    static defaultProps: DiamonNodeWidgetProps;
    constructor(props: DiamonNodeWidgetProps);
    render(): React.DOMElement<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}
export declare var DiamonNodeWidgetFactory: React.ComponentFactory<DiamonNodeWidgetProps, DiamonNodeWidget>;
