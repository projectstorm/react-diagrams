import * as React from 'react';
import { DiagramEngine } from '../../DiagramEngine';
import { LinkModel } from './LinkModel';
import { PointModel } from './PointModel';
import { PortModel } from '../port/PortModel';
import { MouseEvent } from 'react';
import * as _ from 'lodash';
import { LabelWidget } from '../label/LabelWidget';
import { BaseEntityEvent, BasePositionModel, ListenerHandle, PeformanceWidget } from '@projectstorm/react-canvas-core';

export interface LinkProps {
	link: LinkModel;
	diagramEngine: DiagramEngine;
	pointAdded: (point: PointModel, event: MouseEvent) => any;
}

export interface LinkState {
	sourceID: PortModel;
	targetID: PortModel;
}

export class LinkWidget extends React.Component<LinkProps, LinkState> {
	sourceListener: ListenerHandle;
	targetListener: ListenerHandle;

	constructor(props) {
		super(props);
		this.state = {
			sourceID: null,
			targetID: null
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
			sourceID: nextProps.link.getSourcePort(),
			targetID: nextProps.link.getTargetPort()
		};
	}

	ensureInstalled(installSource: boolean, installTarget: boolean) {
		if (installSource) {
			this.sourceListener = this.props.link.getSourcePort().registerListener({
				reportInitialPosition: (event: BaseEntityEvent<BasePositionModel>) => {
					this.forceUpdate();
				}
			});
		}

		if (installTarget) {
			this.targetListener = this.props.link.getTargetPort().registerListener({
				reportInitialPosition: (event: BaseEntityEvent<BasePositionModel>) => {
					this.forceUpdate();
				}
			});
		}
	}

	componentDidUpdate(prevProps: Readonly<LinkProps>, prevState: Readonly<LinkState>, snapshot?: any): void {
		let installSource = false;
		let installTarget = false;
		if (this.state.sourceID !== prevState.sourceID) {
			this.sourceListener && this.sourceListener.deregister();
			installSource = true;
		}
		if (this.state.targetID !== prevState.targetID) {
			this.targetListener && this.targetListener.deregister();
			installTarget = true;
		}
		this.ensureInstalled(installSource, installTarget);
	}

	public static generateLinePath(firstPoint: PointModel, lastPoint: PointModel): string {
		return `M${firstPoint.getX()},${firstPoint.getY()} L ${lastPoint.getX()},${lastPoint.getY()}`;
	}

	componentDidMount(): void {
		this.ensureInstalled(!!this.props.link.getSourcePort(), !!this.props.link.getTargetPort());
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
			<PeformanceWidget serialized={this.props.link.serialize()}>
				{() => {
					return (
						<g>
							{React.cloneElement(this.props.diagramEngine.generateWidgetForLink(link), {
								pointAdded: this.props.pointAdded
							})}
							{_.map(this.props.link.getLabels(), (labelModel, index) => {
								return <LabelWidget engine={this.props.diagramEngine} label={labelModel} index={index} />;
							})}
						</g>
					);
				}}
			</PeformanceWidget>
		);
	}
}
