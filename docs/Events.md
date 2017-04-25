# Events

Each model (DiagramModel, NodeModel etc..) are all built ontop of an event system. You can listen for most of these events by registering
an event on the model itself.

## All models

All models will fire these events:

    lockChanged?(entity: BaseEntity,locked: boolean)

Fires when the lock state of the entity changes. If an element is locked, it cannot be moved or deletes.

## All Base models excluding DiagramModel


    selectionChanged?(item: BaseModel, isSelected:boolean)

When the _selected_ property of a model changes

    entityRemoved?(item:any)

When the entity is going to be deleted. The DiagramModel listeners for this event to when to remove the model from itself.


## DiagramModel

    nodesUpdated(node: any, isCreated:boolean)

When nodes are added or removed

    linksUpdated(link: any, isCreated:boolean)

when links are added or removed

    controlsUpdated() [DEPRECIATED]

_depreciated, use offsetUpdated and zoomUpdated instead_

    offsetUpdated(model: DiagramModel,offsetX: number, offsetY: number)

to know when the canvas was translated in any direction

    zoomUpdated(model: DiagramModel,zoom: number)

to know when the zoom level of the canvas was updated

## DiagramEngine

The diagram engine

    nodeFactoriesUpdated

When node factories have been added or removed from the engine

    linkFactoriesUpdated

When link factories have been added or removed from the engine

## LinkModel

    sourcePortChanged?(item:LinkModel,target: null|PortModel)

    targetPortChanged?(item:LinkModel,target: null|PortModel)


# Example of usage

```javascript
let model = new SRD.DiagramModel();
let node1 = new SRD.DefaultNodeModel("default","rgb(0,192,255)");
node1.addListener({
      entityRemoved: (node) => {
        console.log('Removed', node.id)
      },
      selectionChanged: (node, isSelected) => {
        console.log(isSelected?'Selected':'Unselected', node)
      }
    });
model.addListener({
      linksUpdated:(entity, isAdded) => {
        console.log(isAdded?'added':'removed', entity)
      },
      nodesUpdated: (entity, isAdded) => {
        console.log(isAdded?'added':'removed', entity)
      }
    });
```
