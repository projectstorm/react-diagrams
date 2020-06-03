import * as React from 'react';
import { DefaultLinkModel } from './DefaultLinkModel';
import { DefaultLinkWidget } from './DefaultLinkWidget';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/core';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

namespace S {
	export const Keyframes = keyframes`
		from {
			stroke-dashoffset: 24;
		}
		to {
			stroke-dashoffset: 0;
		}
	`;

	const selected = css`
		stroke-dasharray: 10, 2;
		animation: ${Keyframes} 1s linear infinite;
	`;

	export const Path = styled.path<{ selected: boolean }>`
		${(p) => p.selected && selected};
		fill: none;
		pointer-events: all;
	`;
}

export class DefaultLinkFactory<Link extends DefaultLinkModel = DefaultLinkModel> extends AbstractReactFactory<
	Link,
	DiagramEngine
> {
	constructor(type = 'default') {
		super(type);
	}

	generateReactWidget(event): JSX.Element {
		return <DefaultLinkWidget link={event.model} diagramEngine={this.engine} />;
	}

	generateModel(event): Link {
		return new DefaultLinkModel() as Link;
	}

	generateLinkSegment(model: Link, selected: boolean, path: string) {
		return (
			<S.Path
				selected={selected}
				stroke={selected ? model.getOptions().selectedColor : model.getOptions().color}
				strokeWidth={model.getOptions().width}
				d={path}
			/>
		);
	}
}
