import * as React from 'react';
import { LayerModel } from './LayerModel';
import { CanvasEngine } from '../../CanvasEngine';

export interface SmartLayerWidgetProps {
	layer: LayerModel;
	engine: CanvasEngine;
}

export class SmartLayerWidget extends React.Component<SmartLayerWidgetProps> {
	shouldComponentUpdate(): boolean {
		return this.props.layer.isRepaintEnabled();
	}

	render() {
		return this.props.engine.getFactoryForLayer(this.props.layer).generateReactWidget({ model: this.props.layer });
	}
}
