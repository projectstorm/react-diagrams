import * as React from 'react';
import { NodeLayerModel } from './NodeLayerModel';
import { DiagramEngine } from '../../DiagramEngine';
export interface NodeLayerWidgetProps {
    layer: NodeLayerModel;
    engine: DiagramEngine;
}
export declare class NodeLayerWidget extends React.Component<NodeLayerWidgetProps> {
    render(): JSX.Element;
}
