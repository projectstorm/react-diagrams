import * as React from "react";
import * as _ from "lodash";

export interface BaseWidgetProps {
	/**
	 * Override the base class name
	 */
	baseClass?: string;
	/**
	 * append additional classes
	 */
	className?: string;

	/**
	 * Additional props to add
	 */
	extraProps?: any;
}

export class BaseWidget<P extends BaseWidgetProps = BaseWidgetProps, S = any> extends React.Component<P, S> {
	className: string;

	constructor(name: string, props: P) {
		super(props);
		this.className = name;
	}

	bem(selector: string): string {
		return (this.props.baseClass || this.className) + selector + " ";
	}

	getClassName(): string {
		return (
			(this.props.baseClass || this.className) + " " + (this.props.className ? this.props.className + " " : "")
		);
	}

	getProps(): any {
		return {
			...((this.props.extraProps as any) || {}),
			className: this.getClassName()
		};
	}
}
