# STORM React Diagrams

This library makes it easy to create interactive flow diagrams using react.
You can create custom elements as long as they contain Port Components.

The system is not yet 100% production ready and there are still many improvements regarding speed and optimisation that need to be made, but those are all currently in the works, and will be gradually improved over time.

## Integration into other projects

Here you can see the library integrated into an external web app that has some custom nodes. To create a custom node, register a new factory with the engine that knows how to render the JSON model for that node. As long as you render at least one port component with a unique name in that node, a link can be connected to it.

![Demo2](./demo2.png)

## Usage Demo

This is a demo of the interaction taken directly from the test folder.

![Demo](./demo.gif)
