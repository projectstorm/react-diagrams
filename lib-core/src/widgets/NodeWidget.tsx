import * as React from 'react';
import * as _ from 'lodash';
import { DiagramEngine } from '../DiagramEngine';
import { NodeModel } from '../models/NodeModel';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';

export interface NodeProps extends BaseWidgetProps {
	node: NodeModel;
	children?: any;
	diagramEngine: DiagramEngine;
}

export class NodeWidget extends BaseWidget<NodeProps> {
	ob: ResizeObserver;
	ref: React.RefObject<HTMLDivElement>;

	constructor(props: NodeProps) {
		super('srd-node', props);
		this.ref = React.createRef();
	}

	shouldComponentUpdate() {
		return this.props.diagramEngine.canEntityRepaint(this.props.node);
	}

	getClassName() {
		return 'node ' + super.getClassName() + (this.props.node.isSelected() ? this.bem('--selected') : '');
	}

	componentWillUnmount(): void {
		this.ob.disconnect();
		this.ob = null;
	}

	componentDidMount(): void {
		this.ob = new ResizeObserver(entities => {
			const initial = this.props.node.width;
			const bounds = entities[0].contentRect;
			this.props.node.updateDimensions({ width: bounds.width, height: bounds.height });

			//now mark the links as dirty
			_.forEach(this.props.node.getPorts(), port => {
				_.forEach(port.getLinks(), link => {
					this.props.diagramEngine.linksThatHaveInitiallyRendered[link.getID()] = false;
				});
			});
			if (initial !== 0) {
				this.props.diagramEngine.repaintCanvas();
			}
		});
		this.ob.observe(this.ref.current);
	}

	render() {
		return (
			<div
				ref={this.ref}
				{...this.getProps()}
				data-nodeid={this.props.node.getID()}
				style={{
					top: this.props.node.getY(),
					left: this.props.node.getX()
				}}>
				{this.props.children}
			</div>
		);
	}
}
