import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { CSSProperties } from 'react';
import { LayerModel } from './LayerModel';

export interface TransformLayerWidgetProps {
	layer: LayerModel;
}

namespace S {
	const shared = css`
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		position: absolute;
		pointer-events: none;
		transform-origin: 0 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	`;

	export const DivLayer = styled.div`
		${shared}
	`;

	export const SvgLayer = styled.svg`
		${shared}
	`;
}

export class TransformLayerWidget extends React.Component<TransformLayerWidgetProps> {
	constructor(props: TransformLayerWidgetProps) {
		super(props);
		this.state = {};
	}

	getTransform() {
		const model = this.props.layer.getParent();
		return `
			translate(
				${model.getOffsetX()}px,
				${model.getOffsetY()}px)
			scale(
				${model.getZoomLevel() / 100.0}
			)
  	`;
	}

	getTransformStyle(): CSSProperties {
		if (this.props.layer.getOptions().transformed) {
			return {
				transform: this.getTransform()
			};
		}
		return {};
	}

	render() {
		if (this.props.layer.getOptions().isSvg) {
			return <S.SvgLayer style={this.getTransformStyle()}>{this.props.children}</S.SvgLayer>;
		}
		return <S.DivLayer style={this.getTransformStyle()}>{this.props.children}</S.DivLayer>;
	}
}
