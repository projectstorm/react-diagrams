import * as React from 'react';
import * as _ from 'lodash';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { Toolkit } from '../Toolkit';
import { PortModel } from '../models/PortModel';
import { DiagramEngine } from '../DiagramEngine';
import { ListenerHandle } from '../core/BaseObserver';

export interface PortProps extends BaseWidgetProps {
	port: PortModel;
	engine: DiagramEngine;
}

export interface PortState {
	selected: boolean;
}

export class PortWidget extends BaseWidget<PortProps, PortState> {
	ref: React.RefObject<HTMLDivElement>;
	engineListenerHandle: ListenerHandle;

	constructor(props: PortProps) {
		super('srd-port', props);
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
		if (this.props.engine.canvas) {
			this.report();
		}
	}

	getClassName() {
		return 'port ' + super.getClassName() + (this.state.selected ? this.bem('--selected') : '');
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
				{...this.getProps()}
				onMouseEnter={() => {
					this.setState({ selected: true });
				}}
				onMouseLeave={() => {
					this.setState({ selected: false });
				}}
				data-name={this.props.port.getName()}
				data-nodeid={this.props.port.getNode().getID()}
				{...this.getExtraProps()}
			/>
		);
	}
}
