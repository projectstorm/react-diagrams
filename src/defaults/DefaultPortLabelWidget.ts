import * as React from "react";
import {DefaultPortModel} from "./DefaultPortModel";
import {PortWidget} from "../widgets/PortWidget";

export interface DefaultPortLabelProps {
	model?: DefaultPortModel;
}

export interface DefaultPortLabelState {
}

/**
 * @author Dylan Vorster
 */
export class DefaultPortLabel extends React.Component<DefaultPortLabelProps, DefaultPortLabelState> {

	public static defaultProps: DefaultPortLabelProps = {
		in: true,
		label: "port"
	};

	render() {
		
		var port = React.createElement(PortWidget, {name: this.props.model.name, node: this.props.model.getParent()});
		var label = React.DOM.div({className: 'name'}, this.props.model.label);
		
		return React.DOM.div({className: (this.props.model.in?'in':'out')+'-port'},
			this.props.model.in?port:label,
			this.props.model.in?label:port,
		);
	}
}