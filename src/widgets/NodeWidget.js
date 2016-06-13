var React = require("react");
/**
 * @author Dylan Vorster
 */
module.exports = React.createClass({
	displayName: "NodeWidget",
	getInitialState: function () {
		return {
			mouseDown: false
		};
	},
	getDefaultProps: function () {
		return {
			node: null,
			engine: null
		};
	},
	render: function () {
		return (
			React.DOM.div({
				onMouseDown: function(){
					this.props.engine.setSelectedNode(this.props.node);
				}.bind(this),
				'data-nodeid': this.props.node.id,
				className:'node'+(this.props.engine.state.selectedNode && this.props.engine.state.selectedNode.id == this.props.node.id?' selected':''),
				style:{top:this.props.node.y+this.props.engine.state.offsetY,left: this.props.node.x+this.props.engine.state.offsetX}},
				this.props.children
			)
		);
	}
});