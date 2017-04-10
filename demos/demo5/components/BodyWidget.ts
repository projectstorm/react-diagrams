import * as React from "react";
import {TrayWidgetFactory} from "./TrayWidget";
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
			React.DOM.div({className: "body"},
				React.DOM.div({className:'header'},
					React.DOM.div({className:'title'},"Storm React Diagrams - Demo 5")
				),
				React.DOM.div({className:'content'},
					TrayWidgetFactory(),
					React.createElement(DiagramWidget, {diagramEngine: this.props.app.getDiagramEngine()})
				)
			)
		)
	}
}

export var BodyWidgetFactory = React.createFactory(BodyWidget);