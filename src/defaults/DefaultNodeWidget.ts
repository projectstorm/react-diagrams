import * as React from "react";
import {NodeModel} from "../Common";
import {PortWidget} from "../widgets/PortWidget";

interface DefaultNodeProps {
	name?: string;
	node: NodeModel;
	inPorts?: (string | {name: string, display: string})[];
	outPorts?: (string | {name: string, display: string})[];
	color?: string;
}

interface DefaultNodeState {
}

/**
 * @author Dylan Vorster
 */
export class DefaultNodeWidget extends React.Component<DefaultNodeProps, DefaultNodeState> {

	public static defaultProps: DefaultNodeProps = {
		name: "Node",
		node: null,
		inPorts:[],
		outPorts: [],
		color: 'rgb(50,50,50)',
	};

	constructor(props: DefaultNodeProps) {
		super(props);
		this.state = {
		}
	}

	render() {
		return (
			React.DOM.div({className:'basic-node', style: {background:this.props.color }},
				React.DOM.div({className:'title'},
					React.DOM.div({className:'name'},this.props.name),
					React.DOM.div({className: 'fa fa-close', onClick: this.props.node.remove})
				),
				React.DOM.div({className:'ports'},
					React.DOM.div({className:'in'},this.props.inPorts.map((port) => {
						var portName = "";
						var displayName = "";
						if(typeof port === 'object'){
							portName = port.name;
							displayName = port.display;
						}else{
							portName = port;
							displayName = port;
						}
						return React.DOM.div({className:'in-port',key: portName},
							React.createElement(PortWidget,{name:portName,node:this.props.node}),
							React.DOM.div({className:'name'},displayName)
						);
					})),
					React.DOM.div({className:'out'},this.props.outPorts.map((port) => {
						var portName = "";
						var displayName = "";
						if(typeof port === 'object'){
							portName = port.name;
							displayName = port.display;
						}else{
							portName = port;
							displayName = port;
						}
						return React.DOM.div({className:'out-port',key: portName},
							React.DOM.div({className:'name'},displayName),
							React.createElement(PortWidget,{name:portName,node:this.props.node})
						);
					}))
				)
			)
		);
	}
}