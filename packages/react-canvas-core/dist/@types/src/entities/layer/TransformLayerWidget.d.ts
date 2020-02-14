import * as React from 'react';
import { CSSProperties } from 'react';
import { LayerModel } from './LayerModel';
export interface TransformLayerWidgetProps {
    layer: LayerModel;
}
export declare class TransformLayerWidget extends React.Component<TransformLayerWidgetProps> {
    constructor(props: TransformLayerWidgetProps);
    getTransform(): string;
    getTransformStyle(): CSSProperties;
    render(): JSX.Element;
}
