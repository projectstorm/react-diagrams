import * as React from "react";
import * as _ from "lodash";
import {DefaultNodeModel} from "./DefaultNodeModel";
import {DefaultPortLabel} from "./DefaultPortLabelWidget";
import {DiagramEngine} from "../DiagramEngine";

export interface DefaultNodeProps {
	node: DefaultNodeModel;
	diagramEngine: DiagramEngine;
}

export interface DefaultNodeState {
}

/**
 * @author Dylan Vorster
 */
export class DefaultNodeWidget extends React.Component<DefaultNodeProps, DefaultNodeState> {

	constructor(props: DefaultNodeProps) {
		super(props);
		this.state = {
		}
	}

	generatePort(port){
		return <DefaultPortLabel model={port} key={port.id} />
	}

	render() {
		return (
			<div className="basic-node" style={{background: this.props.node.color}}>
				<div className="title">
					<div className="name">{this.props.node.name}</div>
					<div className="fa fa-close" onClick={() => {
						if(!this.props.diagramEngine.isModelLocked(this.props.node)){
							this.props.node.remove();
							this.props.diagramEngine.repaintCanvas();
						}
					}} />
				</div>
				<div className="ports">
					<div className="in">
						{ _.map(this.props.node.getInPorts(),this.generatePort.bind(this)) }
					</div>
					<div className="out">
						{ _.map(this.props.node.getOutPorts(),this.generatePort.bind(this)) }
					</div>
				</div>
			</div>
		);
	}
}