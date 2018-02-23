import * as React from "react";
import {DefaultLabelModel} from "../models/DefaultLabelModel";

export interface DefaultLabelWidgetProps{
	model: DefaultLabelModel;
}

export class DefaultLabelWidget extends React.Component<DefaultLabelWidgetProps>{

	render(){
		return (
			<div className="default-label">{this.props.model.label}</div>
		);
	}
}