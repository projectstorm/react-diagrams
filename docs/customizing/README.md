# Customizing

Almost all components in react-diagrams are customizable. While some customization is better documented than others, the best way to learn about customization is through the examples in the codebase and by looking at the type annotations that come with the library.

Most UI customization can be done through extending existing base classes. While node, port, and link have different data models, they share the same customization pattern:

- they need a **model factory** extended off `AbstractModelFactory`, and that factory needs to be registered with the engine under a different model type
- optionally, if you data model is different from the default, you can extend existing base classes such as `NodeModel`, `PortModel`, `DefaultLinkModel`, etc.
- they need to have a **custom component** which renders using its default or customized data model. Some component such as the port can also be extended with composition such as port if you want to simply change the appearance.

## Working with custom links

This is the easiest way to get started:

[Extending the default Link](./extending-default-links.md)

## Working with custom nodes

[Working with Nodes](./nodes.md)

[Working with Ports](./ports.md)
