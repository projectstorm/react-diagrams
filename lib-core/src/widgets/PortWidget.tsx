import * as React from 'react';
import * as _ from "lodash";
import { NodeModel } from '../models/NodeModel';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import {Toolkit} from "../Toolkit";

export interface PortProps extends BaseWidgetProps {
	name: string;
	node: NodeModel;
}

export interface PortState {
	selected: boolean;
}

export class PortWidget extends BaseWidget<PortProps, PortState> {
	constructor(props: PortProps) {
		super('srd-port', props);
		this.state = {
			selected: false
		};
	}

	getClassName() {
		return 'port ' + super.getClassName() + (this.state.selected ? this.bem('--selected') : '');
	}

	getExtraProps(){
		if(Toolkit.TESTING){
			const links = _.keys(this.props.node.getPort(this.props.name).links).join(',');
			return {
				'data-links': links
			}
		}
		return {};
	}

	render() {
		return (
			<div
				{...this.getProps()}
				onMouseEnter={() => {
					this.setState({ selected: true });
				}}
				onMouseLeave={() => {
					this.setState({ selected: false });
				}}
				data-name={this.props.name}
				data-nodeid={this.props.node.getID()}
				{...this.getExtraProps()}
			/>
		);
	}
}
