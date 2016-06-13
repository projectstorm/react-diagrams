var React = require("react");
/**
 * @author Dylan Vorster
 */
module.exports = {
	Engine: require("./Engine"),
	CanvasWidget: require("./widgets/CanvasWidget"),
	PortWidget: require("./widgets/PortWidget"),
	BasicNodeWidget: require("./widgets/BasicNodeWidget"),
	
	//convenience methods
	DOM: {
		Canvas: React.createFactory(require("./widgets/CanvasWidget")),
		Port: React.createFactory(require("./widgets/PortWidget")),
		BasicNode: React.createFactory(require("./widgets/BasicNodeWidget")),
	}
};