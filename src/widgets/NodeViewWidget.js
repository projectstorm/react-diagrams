var React = require("react");
var _ = require("lodash");
var Node = require("./NodeWidget");
/**
 * @author Dylan Vorster
 */
module.exports = React.createClass({
	displayName: "NodeViewWidget",
	getInitialState: function () {
		return {
		};
	},
	getDefaultProps: function () {
		return {
			engine: null
		};
	},
	
	render: function () {
		return (
			React.DOM.div({className:'node-view'},
				_.map(this.props.engine.state.nodes,function(node){
					return(
						React.createElement(Node,{key:node.id,node: node,engine: this.props.engine},
							this.props.engine.getNodeFactory(node.type).generateModel(node))
					);
				}.bind(this))
			)
		);
	}
});