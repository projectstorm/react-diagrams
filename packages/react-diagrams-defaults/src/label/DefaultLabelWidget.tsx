import * as React from 'react';
import { DefaultLabelModel } from './DefaultLabelModel';
import styled from '@emotion/styled';

export interface DefaultLabelWidgetProps {
	model: DefaultLabelModel;
}

namespace S {
	export const Label = styled.div`
		background: rgba(0, 0, 0, 0.8);
		border-radius: 5px;
		color: white;
		font-size: 12px;
		padding: 4px 8px;
		font-family: sans-serif;
		user-select: none;
	`;
}

export class DefaultLabelWidget extends React.Component<DefaultLabelWidgetProps> {
	render() {
		return <S.Label>{this.props.model.getOptions().label}</S.Label>;
	}
}
