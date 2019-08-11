# Ports

## Specifying alignment

When links enter ports, depending on the alignment specified, they can help the links render differently. Take the following example:

![](./images/diamond-node.png)

In the above example, the 4 ports on the diamond node are setup with different alignment:

```typescript
this.addPort(new DiamondPortModel(PortModelAlignment.TOP));
this.addPort(new DiamondPortModel(PortModelAlignment.LEFT));
this.addPort(new DiamondPortModel(PortModelAlignment.BOTTOM));
this.addPort(new DiamondPortModel(PortModelAlignment.RIGHT));
```

Each of the custom `DiamondPortModel` models forwards this through to the base `PortModel` class:

```typescript
export class DiamondPortModel extends PortModel {
    ...
	constructor(alignment: PortModelAlignment) {
		super({
			type: 'diamond',
			name: alignment,
			alignment: alignment // <-- here
		});
    }
    ...
}
```

## Specifying if a link can be connected

A port is directly responsible for specifying if a link is allowed to connect to it. When you drag an un-connected link end-point to a target port, the target port lets the link know if it is allowed to connect.

```typescript
class PortModel{
    ...
    canLinkToPort(port: PortModel): boolean;
}
```

In the above definition, the port argument is the source port that the incoming link is connected to. By default, the method returns true, but you can extend this and overide this method to do more advanced checks.

The `DefaultPortModel` provided in the defaults package, makes use of this principle to only allow `Out` ports to connect to `In` ports:

```typescript
class DefaultPortModel extends PortModel{
    ...
    canLinkToPort(port: PortModel): boolean {
		if (port instanceof DefaultPortModel) {
			return this.options.in !== port.getOptions().in;
		}
		return true;
	}
}
```

## Specifying what type of link is generated from a port

When a user drags on a port to generate a link, the port is also responsible for specifying
what link is created. This happens through the `createLinkModel()` method:

```typescript
class DefaultPortModel extends PortModel{
    ...
    createLinkModel(): LinkModel{
        return new DefaultLinkModel(); // <-- here we generate a DefaultLinkModel
    }
}
```