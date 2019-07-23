import {DiagramEngine} from "@projectstorm/react-diagrams-core";
import {
	DefaultLabelFactory,
	DefaultLinkFactory,
	DefaultNodeFactory,
	DefaultPortFactory
} from "@projectstorm/react-diagrams-defaults";

export * from "@projectstorm/react-diagrams-core"
export * from "@projectstorm/react-diagrams-defaults"

/**
 * Construct an engine with the defaults installed
 */
export default (): DiagramEngine => {
	const engine = new DiagramEngine();
	engine.registerLabelFactory(new DefaultLabelFactory());
	engine.registerNodeFactory(new DefaultNodeFactory());
	engine.registerLinkFactory(new DefaultLinkFactory());
	engine.registerPortFactory(new DefaultPortFactory());
	return engine;
}
