import * as React from 'react';
import * as _ from 'lodash';

export interface PeformanceWidgetProps {
	children: () => JSX.Element;
	serialized: object;
}

export interface PeformanceWidgetState {}

export class PeformanceWidget extends React.Component<PeformanceWidgetProps, PeformanceWidgetState> {
	shouldComponentUpdate(
		nextProps: Readonly<PeformanceWidgetProps>,
		nextState: Readonly<PeformanceWidgetState>,
		nextContext: any
	): boolean {
		return !_.isEqual(this.props.serialized, nextProps.serialized);
	}

	render() {
		return this.props.children();
	}
}
