import * as React from 'react';
import { BaseWidget, BaseWidgetProps, DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import { DefaultPortModel } from './DefaultPortModel';

export interface DefaultPortLabelProps extends BaseWidgetProps {
	port: DefaultPortModel;
	engine: DiagramEngine;
}

export interface DefaultPortLabelState {}

export class DefaultPortLabel extends BaseWidget<DefaultPortLabelProps, DefaultPortLabelState> {
	constructor(props) {
		super('srd-default-port', props);
	}

	getClassName() {
		return super.getClassName() + (this.props.port.getOptions().in ? this.bem('--in') : this.bem('--out'));
	}

	render() {
		var port = <PortWidget engine={this.props.engine} port={this.props.port} />;
		var label = <div className="name">{this.props.port.getOptions().label}</div>;

		return (
			<div {...this.getProps()}>
				{this.props.port.getOptions().in ? port : label}
				{this.props.port.getOptions().in ? label : port}
			</div>
		);
	}
}
