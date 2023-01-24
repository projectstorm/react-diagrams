# Architecture Questions

Here I will try to answer any questions relating to the design of the system

## What was the inspiration for this library?

Joint JS \(a fantastic library\) + my need for rich HTML nodes + LabView + Blender Composite sub system

## Why render the nodes as HTML Elements and not SVG's?

My original requirement for this library stemmed from the requirement of wanting HTML nodes that would allow me to embed rich controls such as input fields, dropdowns and have the system treat such nodes as first class citizens. I originally tried to make this work in JointJS, but ran into a number of problems of which this was a relatively big one.

JointJS does allow you to do this, but at the time of writing this library originally, I was having a lot of trouble to make it work exactly like I needed it, and therefore decided from the very beginning that I would attempt this with an HTML first mindset.

## Why Typescript?

Firstly, because it can transpile into any level of ECMAScript. This means that I don't need to break our the refactor tractor every time ECMAScript decides it wants to add features which it should have done years ago.

I also ported it to Typescript to accommodate the heavy architectural changes I was starting to make. Since porting the library to typescript, and seeing the project explode in size and complexity, I consider this the best decision made with regard to this library so far.

Porting to typescript also afforded us a set of powerful features such as generics and static analysis that all the project contributors have made exclusive use of.

Typescript is &lt;3 typescript is life.

## Why not Flow instead of Typescript?

At the time when I first started evaluating languages that could transpile to ECMAScript, I was not so sold on the supporting environment surrounding flow, and found that there was better tooling to support typescript, they are ultimately trying to do the same thing though, and I guess in the end, typescript just made more sense.

## Why React ?

React is really efficient at rendering and managing HTML in a declarative manner. React has also become one of the bigger industry standards and has a rich ecosystem that plays really well with typescript. Apart from these notable points, I am really fond of React and wanted a diagramming library that takes full advantage of it, and makes it easy for engineers to use its power as well, when extending this library.

## Why cant the Default models and widgets do this or that ?

They are intended to illustrate **how** to use this library and act as a good starting point to extend and show the capability. Ultimately I designed this library to be completely pluggable in a way that you can use it as a library and not a framework. If the default widgets are not good enough, then a good place to start is with creating your own models/factories/widgets.

## Model vs Widget

For those that are new to [Scene Graphs](https://en.wikipedia.org/wiki/Scene_graph) or are not familiar with concepts such as [MVC](https://en.wikipedia.org/wiki/Model–view–controller), this library represents your entire graph as a model. The model is a traversable graph that represents the nodes and links between them in a virtual manner. Your program \(aka the business logic/layer\) can mutate this model imperatively or store snapshots decoratively of the complete model \(via serialization\) and then the engine and react widgets will take care of the rendering. For this reason every model in the library is represented by a widget, and the factories glue it all together.

## How do I make my own elements?

Take a look at the **demos** directory, with specific attention to the **DefaultNodeWidget**

That being said, the demos directory is an _example_ of how you can create your own elements. A number of people want to use the defaults as is, which is cool, but is recommended to create your own models/factories/widgets.

## How do I use the library?

Take a look at the demo folders, they have simple and complex examples of the complete usage.

A good example of a real-world example is Demo 5

