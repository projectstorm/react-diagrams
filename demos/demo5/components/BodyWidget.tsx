import * as React from "react";
import {TrayWidget} from "./TrayWidget";
import {DiagramWidget} from "../../../src/main";
import {Application} from "../Application";

export interface BodyWidgetProps {
	app: Application;
}

export interface BodyWidgetState {
}

/**
 * @author Dylan Vorster
 */
export class BodyWidget extends React.Component<BodyWidgetProps, BodyWidgetState> {

	constructor(props: BodyWidgetProps) {
		super(props);
		this.state = {
		}
	}

	render() {
		return (
			<div className="body">
				<div className="header">
					<div className="title">Storm React Diagrams - Demo 5</div>
				</div>
				<div className="content">
					<TrayWidget />
					<DiagramWidget diagramEngine={this.props.app.getDiagramEngine()}/>
				</div>
			</div>
		)
	}
}