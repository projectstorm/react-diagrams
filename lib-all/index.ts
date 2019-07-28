import {
	DiagramEngine,
	MoveCanvasActionFactory,
	MoveItemsActionFactory,
	SelectingItemsActionFactory
} from '@projectstorm/react-diagrams-core';
import {
	DefaultLabelFactory,
	DefaultLinkFactory,
	DefaultNodeFactory,
	DefaultPortFactory
} from '@projectstorm/react-diagrams-defaults';
import { PathFindingLinkFactory } from '@projectstorm/react-diagrams-routing';

export * from '@projectstorm/react-diagrams-core';
export * from '@projectstorm/react-diagrams-defaults';
export * from '@projectstorm/react-diagrams-routing';

/**
 * Construct an engine with the defaults installed
 */
export default (): DiagramEngine => {
	const engine = new DiagramEngine();

	// register model factories
	engine.getLabelFactories().registerFactory(new DefaultLabelFactory());
	engine.getNodeFactories().registerFactory(new DefaultNodeFactory()); // i cant figure out why
	engine.getLinkFactories().registerFactory(new DefaultLinkFactory());
	engine.getLinkFactories().registerFactory(new PathFindingLinkFactory());
	engine.getPortFactories().registerFactory(new DefaultPortFactory());

	// register the default interaction behaviours
	engine.getActionFactories().registerFactory(new MoveCanvasActionFactory());
	engine.getActionFactories().registerFactory(new SelectingItemsActionFactory());
	engine.getActionFactories().registerFactory(new MoveItemsActionFactory());
	return engine;
};
