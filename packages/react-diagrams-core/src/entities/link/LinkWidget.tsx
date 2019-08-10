import * as React from 'react';
import { DiagramEngine } from '../../DiagramEngine';
import { LinkModel } from './LinkModel';
import { PointModel } from './PointModel';
import * as _ from 'lodash';
import { LabelWidget } from '../label/LabelWidget';
import { BaseEntityEvent, BasePositionModel, ListenerHandle, PeformanceWidget } from '@projectstorm/react-canvas-core';
import { PortModel } from '../port/PortModel';

export interface LinkProps {
	link: LinkModel;
	diagramEngine: DiagramEngine;
}

export interface LinkState {
	sourcePort: PortModel;
	targetPort: PortModel;
}

export class LinkWidget extends React.Component<LinkProps, LinkState> {
	sourceListener: ListenerHandle;
	targetListener: ListenerHandle;

	constructor(props) {
		super(props);
		this.state = {
			sourcePort: null,
			targetPort: null
		};
	}

	componentWillUnmount(): void {
		if (this.sourceListener) {
			this.sourceListener.deregister();
		}
		if (this.targetListener) {
			this.targetListener.deregister();
		}
	}

	static getDerivedStateFromProps(nextProps: LinkProps, prevState: LinkState): LinkState {
		return {
			sourcePort: nextProps.link.getSourcePort(),
			targetPort: nextProps.link.getTargetPort()
		};
	}

	installTarget() {
		this.targetListener && this.targetListener.deregister();
		this.targetListener = this.props.link.getTargetPort().registerListener({
			reportInitialPosition: (event: BaseEntityEvent<BasePositionModel>) => {
				this.forceUpdate();
			}
		});
	}

	installSource() {
		this.sourceListener && this.sourceListener.deregister();
		this.sourceListener = this.props.link.getSourcePort().registerListener({
			reportInitialPosition: (event: BaseEntityEvent<BasePositionModel>) => {
				this.forceUpdate();
			}
		});
	}

	componentDidUpdate(prevProps: Readonly<LinkProps>, prevState: Readonly<LinkState>, snapshot) {
		if (prevState.sourcePort !== this.state.sourcePort) {
			this.installSource();
		}
		if (prevState.targetPort !== this.state.targetPort) {
			this.installTarget();
		}
	}

	public static generateLinePath(firstPoint: PointModel, lastPoint: PointModel): string {
		return `M${firstPoint.getX()},${firstPoint.getY()} L ${lastPoint.getX()},${lastPoint.getY()}`;
	}

	componentDidMount(): void {
		if (this.props.link.getSourcePort()) {
			this.installSource();
		}
		if (this.props.link.getTargetPort()) {
			this.installTarget();
		}
	}

	render() {
		const { link } = this.props;

		// only draw the link when we have reported positions
		if (link.getSourcePort() && !link.getSourcePort().reportedPosition) {
			return null;
		}
		if (link.getTargetPort() && !link.getTargetPort().reportedPosition) {
			return null;
		}

		//generate links
		return (
			<PeformanceWidget model={this.props.link} serialized={this.props.link.serialize()}>
				{() => {
					return (
						<g data-linkid={this.props.link.getID()}>
							{this.props.diagramEngine.generateWidgetForLink(link)}
							{_.map(this.props.link.getLabels(), (labelModel, index) => {
								return (
									<LabelWidget
										key={labelModel.getID()}
										engine={this.props.diagramEngine}
										label={labelModel}
										index={index}
									/>
								);
							})}
						</g>
					);
				}}
			</PeformanceWidget>
		);
	}
}
