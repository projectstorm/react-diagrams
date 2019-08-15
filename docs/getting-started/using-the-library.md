# Using the library

## Using Typescript

If you are using typescript, then you are in luck! The library is built in typescript, and includes advanced types for everything you need right out of the box. 

Lets start by including the things we are going to need:

```typescript
import createEngine, { 
    DefaultLinkModel, 
    DefaultNodeModel,
    DiagramModel 
} from '@projectstorm/react-diagrams';

import {
    CanvasWidget
} from '@projectstorm/react-canvas-core';
```

Now we call `createEngine` which will bootstrap a **DiagramEngine** for us that contains all the defaults setup.

```typescript
// create an instance of the engine with all the defaults
const engine = createEngine();
```

Next, we create two nodes:

```typescript
// node 1
const node1 = new DefaultNodeModel({
	name: 'Node 1',
	color: 'rgb(0,192,255)',
});
node1.setPosition(100, 100);
let port1 = node1.addOutPort('Out');

// node 2
const node2 = new DefaultNodeModel({
	name: 'Node 1',
	color: 'rgb(0,192,255)',
});
node2.setPosition(100, 100);
let port2 = node2.addOutPort('Out');
```

Now we link the two ports of both of the nodes:

```typescript
// link them and add a label to the link
const link = port1.link<DefaultLinkModel>(port2);
link.addLabel('Hello World!');
```

Great! Now we have setup a simple diagram. All thats left to do, is create a **DiagramModel** to contain everything, add all the elements to it, and then add it to the engine.

```typescript
const model = new DiagramModel();
model.addAll(node1, node2, link);
engine.setModel(model);
```

And then we render with **React**!

```jsx
<CanvasWidget engine={engine} />
```
