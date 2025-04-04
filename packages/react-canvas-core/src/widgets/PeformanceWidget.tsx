import * as React from 'react';
import _isEqual from 'lodash/isEqual';
import { BaseModel } from '../core-models/BaseModel';
import { JSX } from 'react';

export interface PeformanceWidgetProps {
	children: () => JSX.Element;
	serialized: object;
	model: BaseModel;
}

export interface PeformanceWidgetState {}

export class PeformanceWidget extends React.Component<PeformanceWidgetProps, PeformanceWidgetState> {
	shouldComponentUpdate(
		nextProps: Readonly<PeformanceWidgetProps>,
		nextState: Readonly<PeformanceWidgetState>,
		nextContext: any
	): boolean {
		if (!this.props.model.performanceTune()) {
			return true;
		}
		// deserialization event
		if (this.props.model !== nextProps.model) {
			return true;
		}

		// change event
		return !_isEqual(this.props.serialized, nextProps.serialized);
	}

	render() {
		return this.props.children();
	}
}
