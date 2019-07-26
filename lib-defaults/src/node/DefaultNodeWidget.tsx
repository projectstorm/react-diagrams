import * as React from 'react';
import * as _ from 'lodash';
import { BaseWidget, BaseWidgetProps } from '@projectstorm/react-diagrams-core';
import { DefaultNodeModel } from './DefaultNodeModel';
import { DefaultPortLabel } from '../port/DefaultPortLabelWidget';
import styled from '@emotion/styled';

namespace S {
	export const Node = styled.div<{ background: string }>`
		background-color: ${p => p.background};
		border-radius: 5px;
		font-family: sans-serif;
		color: white;
		border: solid 2px black;
		overflow: visible;
		font-size: 11px;
	`;

	export const Title = styled.div`
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		white-space: nowrap;
		justify-items: center;
	`;

	export const TitleName = styled.div`
		flex-grow: 1;
		padding: 5px 5px;
	`;

	export const Ports = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
	`;

	export const PortsContainer = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	`;
}

export interface DefaultNodeProps extends BaseWidgetProps {
	node: DefaultNodeModel;
}

/**
 * Default node that models the DefaultNodeModel. It creates two columns
 * for both all the input ports on the left, and the output ports on the right.
 */
export class DefaultNodeWidget extends BaseWidget<DefaultNodeProps> {

	listener: any;

	generatePort = port => {
		return <DefaultPortLabel model={port} key={port.id} />;
	};

	componentWillUnmount(): void {

		// release repaint listener
		if(this.listener){
			this.listener();
		}
	}

	componentDidMount(): void {
		this.listener = this.props.node.registerListener({
			eventDidFire: () => {
				this.forceUpdate()
			}
		})
	}

	render() {
		return (
			<S.Node background={this.props.node.getOptions().color}>
				<S.Title>
					<S.TitleName>{this.props.node.getOptions().name}</S.TitleName>
				</S.Title>
				<S.Ports>
					<S.PortsContainer>{_.map(this.props.node.getInPorts(), this.generatePort)}</S.PortsContainer>
					<S.PortsContainer>{_.map(this.props.node.getOutPorts(), this.generatePort)}</S.PortsContainer>
				</S.Ports>
			</S.Node>
		);
	}
}
