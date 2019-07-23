import * as React from "react";
import {PortWidget} from "@projectstorm/react-diagrams-core";
import {TSCustomNodeModel} from "./TSCustomNodeModel";

export interface TSCustomNodeWidgetProps {
	node: TSCustomNodeModel;
}

export interface TSCustomNodeWidgetState {
}

export class TSCustomNodeWidget extends React.Component<TSCustomNodeWidgetProps, TSCustomNodeWidgetState> {

  constructor(props: TSCustomNodeWidgetProps) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className="custom-node">
        <PortWidget node={this.props.node} name="in" />
				<PortWidget node={this.props.node} name="out" />
      </div>
    );
  }
}
