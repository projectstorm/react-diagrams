import * as React from 'react';
import { DiagramEngine, DiagramWidget } from '@projectstorm/react-diagrams';

export interface BodyWidgetProps {
	engine: DiagramEngine;
}

export class BodyWidget extends React.Component<BodyWidgetProps> {
	render() {
		return <DiagramWidget className="diagram-container" diagramEngine={this.props.engine} />;
	}
}
