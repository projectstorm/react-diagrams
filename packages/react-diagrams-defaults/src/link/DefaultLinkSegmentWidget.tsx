import * as React from 'react';
import { DefaultLinkFactory } from './DefaultLinkFactory';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { DefaultLinkModel } from './DefaultLinkModel';

export interface DefaultLinkSegmentWidgetProps {
	path: string;
	link: DefaultLinkModel;
	selected: boolean;
	forwardRef: React.RefObject<SVGPathElement>;
	factory: DefaultLinkFactory;
	diagramEngine: DiagramEngine;
	onSelection: (selected: boolean) => any;
	extras: object;
}

export class DefaultLinkSegmentWidget extends React.Component<DefaultLinkSegmentWidgetProps> {
	render() {
		const Bottom = React.cloneElement(
			this.props.factory.generateLinkSegment(
				this.props.link,
				this.props.selected || this.props.link.isSelected(),
				this.props.path
			),
			{
				ref: this.props.forwardRef
			}
		);

		const Top = React.cloneElement(Bottom, {
			strokeLinecap: 'round',
			onMouseLeave: () => {
				this.props.onSelection(false);
			},
			onMouseEnter: () => {
				this.props.onSelection(true);
			},
			...this.props.extras,
			ref: null,
			'data-linkid': this.props.link.getID(),
			strokeOpacity: this.props.selected ? 0.1 : 0,
			strokeWidth: 20,
			fill: 'none',
			onContextMenu: () => {
				if (!this.props.link.isLocked()) {
					event.preventDefault();
					this.props.link.remove();
				}
			}
		});

		return (
			<g>
				{Bottom}
				{Top}
			</g>
		);
	}
}
