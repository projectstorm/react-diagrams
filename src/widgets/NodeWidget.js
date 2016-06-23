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
	
	shouldComponentUpdate: function(){
		if(this.props.engine.state.updatingNodes !== null){
			return this.props.engine.state.updatingNodes[this.props.node.id] !== undefined;
		}
		return true;
	},
	
	render: function () {
		return (
			React.DOM.div({
				onMouseDown: function(){
					this.props.engine.setSelectedNode(this.props.node);
				}.bind(this),
				'data-nodeid': this.props.node.id,
				className:'node'+(this.props.engine.state.selectedNode && this.props.engine.state.selectedNode.id == this.props.node.id?' selected':''),
				style:{
					top: this.props.node.y,
					left: this.props.node.x,
				}},
				this.props.children
			)
		);
	}
});