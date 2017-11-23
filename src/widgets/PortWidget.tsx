import * as React from "react";
import {NodeModel} from "../models/NodeModel";

export interface PortProps {
	name: string;
	node: NodeModel;
}

export interface PortState {
	selected: boolean;
}

/**
 * @author Dylan Vorster
 */
export class PortWidget extends React.Component<PortProps, PortState> {
	constructor(props: PortProps) {
		super(props);
		this.state = {
			selected: false
		};
	}

	render() {
		return (
			<div
				onMouseEnter={() => {
					this.setState({ selected: true });
				}}
				onMouseLeave={() => {
					this.setState({ selected: false });
				}}
				className={"port" + (this.state.selected ? " selected" : "")}
				data-name={this.props.name}
				data-nodeid={this.props.node.getID()}
			/>
		);
	}
}
