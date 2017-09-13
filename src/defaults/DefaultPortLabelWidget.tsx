import * as React from "react";
import { DefaultPortModel } from "./DefaultPortModel";
import { PortWidget } from "../widgets/PortWidget";

export interface DefaultPortLabelProps {
	model?: DefaultPortModel;
	in?: boolean;
	label?: string;
}

export interface DefaultPortLabelState {}

/**
 * @author Dylan Vorster
 */
export class DefaultPortLabel extends React.Component<
	DefaultPortLabelProps,
	DefaultPortLabelState
> {
	public static defaultProps: DefaultPortLabelProps = {
		in: true,
		label: "port"
	};

	render() {
		var port = (
			<PortWidget
				node={this.props.model.getParent()}
				name={this.props.model.name}
			/>
		);
		var label = <div className="name">{this.props.model.label}</div>;

		return (
			<div className={(this.props.model.in ? "in" : "out") + "-port"}>
				{this.props.model.in ? port : label}
				{this.props.model.in ? label : port}
			</div>
		);
	}
}
