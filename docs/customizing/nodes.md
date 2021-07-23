# Nodes

A node contains the node content itself and its ports. Check [NodeModel source code](https://github.com/projectstorm/react-diagrams/blob/master/packages/react-diagrams-core/src/entities/node/NodeModel.ts#L24), if you want to see what class methods can be extended.

## Extending the NodeModel

If you want to create a custom node that looks entirely different, then you need to create a component that renders using its default or customized data mode. In the example below, it uses a customized data model `DiamondNodeModel` to render `DiamondNodeWidget`, and both of them are being created in the model factory `DiamondNodeFactory`.

![](./images/diamond-node.png)

Because our Diamond node always has four ports, we add four default port models into the `DiamondNodeModel`. Depending on the type of node you are creating, this is basically where you store your vertex data in the graph theory sense.

```typescript
// DiamondNodeModel.ts
import { NodeModel, NodeModelGenerics, PortModelAlignment } from '@projectstorm/react-diagrams';
import { DiamondPortModel } from './DiamondPortModel';

export interface DiamondNodeModelGenerics {
	PORT: DiamondPortModel;
}

// this can be further extended for more complicated node types
export class DiamondNodeModel extends NodeModel<NodeModelGenerics & DiamondNodeModelGenerics> {
	constructor() {
		super({
			type: 'diamond'
		});
		this.addPort(new DiamondPortModel(PortModelAlignment.TOP));
		this.addPort(new DiamondPortModel(PortModelAlignment.LEFT));
		this.addPort(new DiamondPortModel(PortModelAlignment.BOTTOM));
		this.addPort(new DiamondPortModel(PortModelAlignment.RIGHT));
	}
}
```

This is where we create our customized component. This component can be any customized react component as long as they respect the node and engine props. Ports also need to be rendered inside the node component.

```typescript
// DiamondNodeWidget.tsx
import * as React from 'react';
import { DiamondNodeModel } from './DiamondNodeModel';
import { DiagramEngine, PortModelAlignment, PortWidget } from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';

export interface DiamondNodeWidgetProps {
	// node and engine props are required
	node: DiamondNodeModel;
	engine: DiagramEngine;
	size?: number;
}

namespace S {
	export const Port = styled.div`
		width: 16px;
		height: 16px;
		z-index: 10;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 8px;
		cursor: pointer;
		&:hover {
			background: rgba(0, 0, 0, 1);
		}
	`;
}

// this can be any customized react component as long as they respect
// the node and engine props
export class DiamondNodeWidget extends React.Component<DiamondNodeWidgetProps> {
	render() {
		return (
			<div
				className={'diamond-node'}
				style={{
					position: 'relative',
					width: this.props.size,
					height: this.props.size
				}}>
				<svg
					width={this.props.size}
					height={this.props.size}
					dangerouslySetInnerHTML={{
						__html:
							`
          <g id="Layer_1">
          </g>
          <g id="Layer_2">
            <polygon fill="mediumpurple" stroke="${
							this.props.node.isSelected() ? 'white' : '#000000'
						}" stroke-width="3" stroke-miterlimit="10" points="10,` +
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
				<PortWidget
					style={{
						top: this.props.size / 2 - 8,
						left: -8,
						position: 'absolute'
					}}
					port={this.props.node.getPort(PortModelAlignment.LEFT)}
					engine={this.props.engine}>
					<S.Port />
				</PortWidget>
				<PortWidget
					style={{
						left: this.props.size / 2 - 8,
						top: -8,
						position: 'absolute'
					}}
					port={this.props.node.getPort(PortModelAlignment.TOP)}
					engine={this.props.engine}>
					<S.Port />
				</PortWidget>
				<PortWidget
					style={{
						left: this.props.size - 8,
						top: this.props.size / 2 - 8,
						position: 'absolute'
					}}
					port={this.props.node.getPort(PortModelAlignment.RIGHT)}
					engine={this.props.engine}>
					<S.Port />
				</PortWidget>
				<PortWidget
					style={{
						left: this.props.size / 2 - 8,
						top: this.props.size - 8,
						position: 'absolute'
					}}
					port={this.props.node.getPort(PortModelAlignment.BOTTOM)}
					engine={this.props.engine}>
					<S.Port />
				</PortWidget>
			</div>
		);
	}
}
```

Now we need to create a new node factory to tell the system how our new node model fits into the core system. We specifically are going to extend the `DefaultLinkFactory` because we want to render a `DiamondNodeWidget` with data model being `DiamondNodeModel`. To accomplish that, we simply extend `generateReactWidget(event)` to return a `DiamondNodeWidget` and extend `generateModel` to return a `DiamondNodeModel` instance.

```typescript
// DiamondNodeFactory.tsx
import { DiamondNodeWidget } from './DiamondNodeWidget';
import { DiamondNodeModel } from './DiamondNodeModel';
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class DiamondNodeFactory extends AbstractReactFactory<DiamondNodeModel, DiagramEngine> {
	constructor() {
		super('diamond');
	}

	generateReactWidget(event): JSX.Element {
		// event.model is basically what's returned from generateModel()
		return <DiamondNodeWidget engine={this.engine} size={50} node={event.model} />;
	}

	generateModel(event) {
		return new DiamondNodeModel();
	}
}
```

The actual code for the `DiamondNode` [can be found here](https://github.com/projectstorm/react-diagrams/tree/master/diagrams-demo-gallery/demos/demo-custom-node1) (it is in the `demo-custom-node1` folder in the demo gallery).

This is the easiest and most simple way to get started with custom nodes. 
