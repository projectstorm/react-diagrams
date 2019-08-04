import * as React from 'react';
import styled from '@emotion/styled';
import * as _ from 'lodash';
import { LinkWidget } from '../link/LinkWidget';
import { LinkLayerModel } from './LinkLayerModel';
import { DiagramEngine } from '../../DiagramEngine';
import { PointModel } from '../link/PointModel';

export interface LinkLayerWidgetProps {
	layer: LinkLayerModel;
	engine: DiagramEngine;
}

export interface LinkLayerWidgetState {}

namespace S {
	export const Container = styled.div``;
}

export class LinkLayerWidget extends React.Component<LinkLayerWidgetProps, LinkLayerWidgetState> {
	constructor(props: LinkLayerWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<>
				{//only perform these actions when we have a diagram
				_.map(this.props.layer.getLinks(), link => {
					return (
						<LinkWidget
							pointAdded={(point: PointModel, event) => {
								// event.stopPropagation();
								//
								// // TODO implement this better and more generic
								// let action: MoveItemsAction = null;
								// let fac: MoveItemsActionFactory = null;
								// try {
								// 	fac = this.props.engine.getActionFactories().getFactory<MoveItemsActionFactory>(MoveItemsActionFactory.NAME);
								// } catch (e) {}
								// if (fac) {
								// 	action = fac.generateAction(event);
								// 	action.fireMouseDown({
								// 		selectedModel: point,
								// 		selectedEntity: event.target as HTMLElement,
								// 		mouseEvent: event
								// 	});
								// 	this.startFiringAction(action);
								// }
							}}
							key={link.getID()}
							link={link}
							diagramEngine={this.props.engine}
						/>
					);
				})}
			</>
		);
	}
}
