import * as React from 'react';
import * as _ from 'lodash';
import { DiagramEngine } from '../../DiagramEngine';
import { NodeModel } from './NodeModel';
import { BaseEntityEvent, BaseModel, ListenerHandle, PeformanceWidget } from '@projectstorm/react-canvas-core';
import styled from '@emotion/styled';
import ResizeObserver from 'resize-observer-polyfill';

export interface NodeProps {
	node: NodeModel;
	children?: any;
	diagramEngine: DiagramEngine;
}

namespace S {
	export const Node = styled.div`
		position: absolute;
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Chrome/Safari/Opera */
		user-select: none;
		cursor: move;
		pointer-events: all;
	`;
}

export class NodeWidget extends React.Component<NodeProps> {
	ob: any;
	ref: React.RefObject<HTMLDivElement>;
	listener: ListenerHandle;

	constructor(props: NodeProps) {
		super(props);
		this.ref = React.createRef();
	}

	componentWillUnmount(): void {
		this.ob.disconnect();
		this.ob = null;
	}

	componentDidUpdate(prevProps: Readonly<NodeProps>, prevState: Readonly<any>, snapshot?: any): void {
		if (this.listener && this.props.node !== prevProps.node) {
			this.listener.deregister();
			this.installSelectionListener();
		}
	}

	installSelectionListener() {
		this.listener = this.props.node.registerListener({
			selectionChanged: (event: BaseEntityEvent<BaseModel> & { isSelected: boolean }) => {
				this.forceUpdate();
			}
		});
	}

	componentDidMount(): void {
		// @ts-ignore
		this.ob = new ResizeObserver(entities => {
			const bounds = entities[0].contentRect;
			this.props.node.updateDimensions({ width: bounds.width, height: bounds.height });

			//now mark the links as dirty
			_.forEach(this.props.node.getPorts(), port => {
				port.updateCoords(this.props.diagramEngine.getPortCoords(port));
			});
		});
		this.ob.observe(this.ref.current);
		this.installSelectionListener();
	}

	render() {
		return (
			<PeformanceWidget model={this.props.node} serialized={this.props.node.serialize()}>
				{() => {
					return (
						<S.Node
							className="node"
							ref={this.ref}
							data-nodeid={this.props.node.getID()}
							style={{
								top: this.props.node.getY(),
								left: this.props.node.getX()
							}}>
							{this.props.diagramEngine.generateWidgetForNode(this.props.node)}
						</S.Node>
					);
				}}
			</PeformanceWidget>
		);
	}
}
