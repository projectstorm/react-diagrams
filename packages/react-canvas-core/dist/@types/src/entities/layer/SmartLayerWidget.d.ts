import * as React from 'react';
import { LayerModel } from './LayerModel';
import { CanvasEngine } from '../../CanvasEngine';
export interface SmartLayerWidgetProps {
    layer: LayerModel;
    engine: CanvasEngine;
}
export declare class SmartLayerWidget extends React.Component<SmartLayerWidgetProps> {
    shouldComponentUpdate(): boolean;
    render(): JSX.Element;
}
