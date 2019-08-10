import * as React from 'react';
import * as _ from 'lodash';
import { PortModel } from './PortModel';
import { DiagramEngine } from '../../DiagramEngine';
import { ListenerHandle, Toolkit } from '@projectstorm/react-canvas-core';

export interface PortProps {
	port: PortModel;
	engine: DiagramEngine;
	className?;
	style?;
}

export class PortWidget extends React.Component<PortProps> {
	ref: React.RefObject<HTMLDivElement>;
	engineListenerHandle: ListenerHandle;

	constructor(props: PortProps) {
		super(props);
		this.ref = React.createRef();
	}

	report() {
		this.props.port.updateCoords(this.props.engine.getPortCoords(this.props.port, this.ref.current));
	}

	componentWillUnmount(): void {
		this.engineListenerHandle && this.engineListenerHandle.deregister();
	}

	componentDidUpdate(prevProps: Readonly<PortProps>, prevState, snapshot?: any): void {
		if (!this.props.port.reportedPosition) {
			this.report();
		}
	}

	componentDidMount(): void {
		this.engineListenerHandle = this.props.engine.registerListener({
			canvasReady: () => {
				this.report();
			}
		});
		if (this.props.engine.getCanvas()) {
			this.report();
		}
	}

	getExtraProps() {
		if (Toolkit.TESTING) {
			const links = _.keys(this.props.port.getNode().getPort(this.props.port.getName()).links).join(',');
			return {
				'data-links': links
			};
		}
		return {};
	}

	render() {
		return (
			<div
				style={this.props.style}
				ref={this.ref}
				className={`port ${this.props.className || ''}`}
				data-name={this.props.port.getName()}
				data-nodeid={this.props.port.getNode().getID()}
				{...this.getExtraProps()}>
				{this.props.children}
			</div>
		);
	}
}
