import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import { DefaultPortModel } from './DefaultPortModel';
import styled from '@emotion/styled';

export interface DefaultPortLabelProps {
	port: DefaultPortModel;
	engine: DiagramEngine;
}

namespace S {
	export const PortLabel = styled.div`
		display: flex;
		margin-top: 1px;
		align-items: center;
	`;

	export const Label = styled.div`
		padding: 0 5px;
	`;
}

export class DefaultPortLabel extends React.Component<DefaultPortLabelProps> {
	render() {
		const port = <PortWidget engine={this.props.engine} port={this.props.port} />;
		const label = <S.Label>{this.props.port.getOptions().label}</S.Label>;

		return (
			<S.PortLabel>
				{this.props.port.getOptions().in ? port : label}
				{this.props.port.getOptions().in ? label : port}
			</S.PortLabel>
		);
	}
}
