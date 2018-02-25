import * as React from "react";
import { DefaultLabelModel } from "../models/DefaultLabelModel";
import { BaseWidget, BaseWidgetProps } from "../../widgets/BaseWidget";

export interface DefaultLabelWidgetProps extends BaseWidgetProps {
	model: DefaultLabelModel;
}

export class DefaultLabelWidget extends BaseWidget<DefaultLabelWidgetProps> {
	constructor(props) {
		super("srd-default-label", props);
	}

	render() {
		return <div {...this.getProps()}>{this.props.model.label}</div>;
	}
}
