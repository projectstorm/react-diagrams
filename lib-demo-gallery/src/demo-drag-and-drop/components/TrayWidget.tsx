import * as React from "react";

export interface TrayWidgetProps {}

export interface TrayWidgetState {}

/**
 * @author Dylan Vorster
 */
export class TrayWidget extends React.Component<TrayWidgetProps, TrayWidgetState> {
	public static defaultProps: TrayWidgetProps = {};

	constructor(props: TrayWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		return <div className="tray">{this.props.children}</div>;
	}
}
