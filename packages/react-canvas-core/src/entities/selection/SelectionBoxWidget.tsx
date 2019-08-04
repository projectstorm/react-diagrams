import * as React from 'react';
import styled from '@emotion/styled';

export interface SelectionBoxWidgetProps {
	rect: ClientRect;
}

namespace S {
	export const Container = styled.div`
		position: absolute;
		background-color: rgba(0, 192, 255, 0.2);
		border: solid 2px rgb(0, 192, 255);
	`;
}

export class SelectionBoxWidget extends React.Component<SelectionBoxWidgetProps> {
	render() {
		const { rect } = this.props;
		return (
			<S.Container
				style={{
					top: rect.top,
					left: rect.left,
					width: rect.width,
					height: rect.height
				}}
			/>
		);
	}
}
