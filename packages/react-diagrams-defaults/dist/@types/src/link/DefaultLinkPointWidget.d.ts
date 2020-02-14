import * as React from 'react';
import { PointModel } from '@projectstorm/react-diagrams-core';
export interface DefaultLinkPointWidgetProps {
    point: PointModel;
    color?: string;
    colorSelected: string;
}
export interface DefaultLinkPointWidgetState {
    selected: boolean;
}
export declare class DefaultLinkPointWidget extends React.Component<DefaultLinkPointWidgetProps, DefaultLinkPointWidgetState> {
    constructor(props: any);
    render(): JSX.Element;
}
