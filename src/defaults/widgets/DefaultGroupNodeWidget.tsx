import { BaseWidget, BaseWidgetProps } from "../../widgets/BaseWidget";
import * as React from "react";
import { DefaultGroupNodeModel } from "../models/DefaultGroupNodeModel";

export interface DefaultGroupNodeWidgetProps extends BaseWidgetProps {
	node: DefaultGroupNodeModel;
}

export class DefaultGroupNodeWidget extends BaseWidget<DefaultGroupNodeWidgetProps> {
	constructor(props: DefaultGroupNodeWidgetProps) {
		super("srd-default-group-node", props);
	}

	render() {
		return (
			<div {...this.getProps()}>
				<div className={this.bem("__title")}>
					<div className={this.bem("__name")}>{this.props.node.title}</div>
				</div>
				<div className={this.bem("__container")} />
			</div>
		);
	}
}
