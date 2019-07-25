import * as React from 'react';
import { BaseWidget, BaseWidgetProps, PortWidget } from '@projectstorm/react-diagrams-core';
import { DefaultPortModel } from './DefaultPortModel';

export interface DefaultPortLabelProps extends BaseWidgetProps {
	model: DefaultPortModel;
}

export interface DefaultPortLabelState {}

export class DefaultPortLabel extends BaseWidget<DefaultPortLabelProps, DefaultPortLabelState> {
	constructor(props) {
		super('srd-default-port', props);
	}

	getClassName() {
		return super.getClassName() + (this.props.model.getOptions().in ? this.bem('--in') : this.bem('--out'));
	}

	render() {
		var port = <PortWidget node={this.props.model.getParent()} name={this.props.model.getOptions().name} />;
		var label = <div className="name">{this.props.model.getOptions().label}</div>;

		return (
			<div {...this.getProps()}>
				{this.props.model.getOptions().in ? port : label}
				{this.props.model.getOptions().in ? label : port}
			</div>
		);
	}
}
