# Changelog

## 6.0.0

### Breaking changes

* `AbstractFactory:getNewInstance` renamed to `AbstractFactory:generateModel` and now gets given an event object
so that we can add to the event object without relying on more parameters

* `AbstractFactory::generateReactWidget` now receives an event object

* Moved factories in the diagramEngine into `FactoryBank`'s, which means we can remove the listeners in the DiagramEngine.
methods such as factoryAdded and factoryRemoved are now available on the FactoryBank (better design that allows more control) 

* `addListener` renamed to `registerListener`
