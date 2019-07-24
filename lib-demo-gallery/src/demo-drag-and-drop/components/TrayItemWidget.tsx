import * as React from 'react';

export interface TrayItemWidgetProps {
	model: any;
	color?: string;
	name: string;
}

export interface TrayItemWidgetState {}

export class TrayItemWidget extends React.Component<TrayItemWidgetProps, TrayItemWidgetState> {
	constructor(props: TrayItemWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div
				style={{ borderColor: this.props.color }}
				draggable={true}
				onDragStart={event => {
					event.dataTransfer.setData('storm-diagram-node', JSON.stringify(this.props.model));
				}}
				className="tray-item">
				{this.props.name}
			</div>
		);
	}
}
