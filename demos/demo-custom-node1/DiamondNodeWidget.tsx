import * as React from "react";
import { DiamondNodeModel } from "./DiamondNodeModel";
import { PortWidget } from "../../src/main";

export interface DiamonNodeWidgetProps {
	node: DiamondNodeModel;
	size?: number;
}

export interface DiamonNodeWidgetState {}

/**
 * @author Dylan Vorster
 */
export class DiamonNodeWidget extends React.Component<DiamonNodeWidgetProps, DiamonNodeWidgetState> {
	public static defaultProps: DiamonNodeWidgetProps = {
		size: 150,
		node: null
	};

	constructor(props: DiamonNodeWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div
				className={"diamond-node"}
				style={{
					position: "relative",
					width: this.props.size,
					height: this.props.size
				}}
			>
				<svg
					width={this.props.size}
					height={this.props.size}
					dangerouslySetInnerHTML={{
						__html:
							`
          <g id="Layer_1">
          </g>
          <g id="Layer_2">
            <polygon fill="purple" stroke="#000000" stroke-width="3" stroke-miterlimit="10" points="10,` +
							this.props.size / 2 +
							` ` +
							this.props.size / 2 +
							`,10 ` +
							(this.props.size - 10) +
							`,` +
							this.props.size / 2 +
							` ` +
							this.props.size / 2 +
							`,` +
							(this.props.size - 10) +
							` "/>
          </g>
        `
					}}
				/>
				<div
					style={{
						position: "absolute",
						zIndex: 10,
						top: this.props.size / 2 - 8,
						left: -8
					}}
				>
					<PortWidget name="left" node={this.props.node} />
				</div>
				<div
					style={{
						position: "absolute",
						zIndex: 10,
						left: this.props.size / 2 - 8,
						top: -8
					}}
				>
					<PortWidget name="top" node={this.props.node} />
				</div>
				<div
					style={{
						position: "absolute",
						zIndex: 10,
						left: this.props.size - 8,
						top: this.props.size / 2 - 8
					}}
				>
					<PortWidget name="right" node={this.props.node} />
				</div>
				<div
					style={{
						position: "absolute",
						zIndex: 10,
						left: this.props.size / 2 - 8,
						top: this.props.size - 8
					}}
				>
					<PortWidget name="bottom" node={this.props.node} />
				</div>
			</div>
		);
	}
}
