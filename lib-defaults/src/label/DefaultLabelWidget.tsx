import * as React from 'react';
import { BaseWidget, BaseWidgetProps } from '@projectstorm/react-diagrams-core';
import { DefaultLabelModel } from './DefaultLabelModel';

export interface DefaultLabelWidgetProps extends BaseWidgetProps {
	model: DefaultLabelModel;
}

export class DefaultLabelWidget extends BaseWidget<DefaultLabelWidgetProps> {
	constructor(props) {
		super('srd-default-label', props);
	}

	render() {
		return <div {...this.getProps()}>{this.props.model.getOptions().label}</div>;
	}
}
