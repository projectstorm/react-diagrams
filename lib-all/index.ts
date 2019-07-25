import { DiagramEngine } from '@projectstorm/react-diagrams-core';
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
	engine.getLabelFactories().registerFactory(new DefaultLabelFactory());
	engine.getNodeFactories().registerFactory(new DefaultNodeFactory());
	engine.getLinkFactories().registerFactory(new DefaultLinkFactory());
	engine.getLinkFactories().registerFactory(new PathFindingLinkFactory());
	engine.getPortFactories().registerFactory(new DefaultPortFactory());
	return engine;
};
