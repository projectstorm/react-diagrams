import * as React from 'react';
import * as _ from 'lodash';
import { PortModel } from './PortModel';
import { DiagramEngine } from '../../DiagramEngine';
import {ListenerHandle, Toolkit} from "@projectstorm/react-canvas-core";

export interface PortProps {
	port: PortModel;
	engine: DiagramEngine;
}

export interface PortState {
	selected: boolean;
}

export class PortWidget extends React.Component<PortProps, PortState> {
	ref: React.RefObject<HTMLDivElement>;
	engineListenerHandle: ListenerHandle;

	constructor(props: PortProps) {
		super(props);
		this.ref = React.createRef();
		this.state = {
			selected: false
		};
	}

	report() {
		this.props.port.updateCoords(this.props.engine.getPortCoords(this.props.port, this.ref.current));
	}

	componentWillUnmount(): void {
		this.engineListenerHandle.deregister();
	}

	componentDidUpdate(prevProps: Readonly<PortProps>, prevState: Readonly<PortState>, snapshot?: any): void {
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
				ref={this.ref}
				className="port"
				onMouseEnter={() => {
					this.setState({ selected: true });
				}}
				onMouseLeave={() => {
					this.setState({ selected: false });
				}}
				data-name={this.props.port.getName()}
				data-nodeid={this.props.port.getNode().getID()}
				{...this.getExtraProps()}
			>
				{this.props.children}
			</div>
		);
	}
}
