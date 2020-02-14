import * as React from 'react';
import { LinkLayerModel } from './LinkLayerModel';
import { DiagramEngine } from '../../DiagramEngine';
export interface LinkLayerWidgetProps {
    layer: LinkLayerModel;
    engine: DiagramEngine;
}
export declare class LinkLayerWidget extends React.Component<LinkLayerWidgetProps> {
    render(): JSX.Element;
}
