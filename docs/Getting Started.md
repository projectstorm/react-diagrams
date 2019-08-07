# Getting started

## Installation via NPM

The first thing you need to do, is grab the distribution files on NPM. You can do this either using yarn or npm

**Via yarn:**

```
yarn add @projectstorm/react-diagrams
```

**Via npm:**

```
npm install @projectstorm/react-diagrams
```

When you run this in your project directory, this will install the library into node\_modules/storm-react-diagrams. You will then find a dist folder that contains all the minified and production ready code.

This will also install React and a few other dependencies that you need in order to use this library.

## Including the library

When including the library you will need both the javascript files as well as the raw BEM styles. Both are included in the dist folder and there are numerous ways to integrate them into your project:

#### Getting the javascript files

**Using Typescript / ES6: \(recommended\)**

```js
import * as SRD from "@projectstorm/react-diagrams"
```

**Using RequireJS:**

```js
var SRD = require("@projectstorm/react-diagrams")
```

**As a script tag \(not recommended\)**

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
<script src="node_modules/storm-react-diagrams/dist/main.js">
```

#### Getting the CSS

**Using RequireJS / Typescript/ ES6 \(recommended\)**

Make sure you have the style-loader enabled and then:

```js
require("storm-react-diagrams/dist/style.min.css");
```

or make sure you have the sass-loader enabled and then:

```js
require("storm-react-diagrams/src/sass/main.scss");
```

If you are using typescript and get a "require function not found" then make sure to

```
yarn add @types/node
```

which will give you the typescript definition files for requireJS

**Using SASS:**

setup your include paths on webpack or lib sass using the following option

```
includePaths: ["node_modules"]
```

and then if you want the raw sass source code:

```sass
@import "~storm-react-diagrams/src/sass/main";
```

or if you want the minified css

```sass
@import "~storm-react-diagrams/dist/style.min";
```

**Using a style tag**

or if you want the minified css

```html
<link rel="stylesheet" href="node_modules/dist/style.min.css">
```

## Render your first diagram

In your library code

```js
// 1) setup the diagram engine
var engine = new SRD.DiagramEngine();
engine.installDefaultFactories();

// 2) setup the diagram model
var model = new SRD.DiagramModel();

// 3) create a default node
var node1 = new SRD.DefaultNodeModel("Node 1", "rgb(0,192,255)");
let port1 = node1.addOutPort("Out");
node1.setPosition(100, 100);

// 4) create another default node
var node2 = new SRD.DefaultNodeModel("Node 2", "rgb(192,255,0)");
let port2 = node2.addInPort("In");
node2.setPosition(400, 100);

// 5) link the ports
let link1 = port1.link(port2);

// 6) add the models to the root graph
model.addAll(node1, node2, link1);

// 7) load model into engine
engine.setDiagramModel(model);
```

And then create an instance of the diagram widget. An example of the simplest possible react widget to do this would be:

```jsx
function SimpleDiagramWidget(props) {
  return <SRD.DiagramWidget diagramEngine={props.engine} />;
}
```



