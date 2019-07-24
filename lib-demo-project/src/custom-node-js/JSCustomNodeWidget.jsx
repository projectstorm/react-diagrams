import * as React from "react";
import {PortWidget} from "@projectstorm/react-diagrams";

export class JSCustomNodeWidget extends React.Component {

	render() {
		return (
			<div className="custom-node">
				<PortWidget node={this.props.node} name="in"/>
				<PortWidget node={this.props.node} name="out"/>
				<div className="custom-node-color" style={{backgroundColor: this.props.node.color}} />
			</div>
		);
	}
}
