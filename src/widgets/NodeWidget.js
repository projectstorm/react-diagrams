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
			engine: null,
		};
	},
	componentDidMount: function(){
		
	},
	render: function () {
		return (
			React.DOM.div({
				'data-nodeid': this.props.node.id,
				className:'node',
				style:{top:this.props.node.y+this.props.engine.state.offsetY,left: this.props.node.x+this.props.engine.state.offsetX}},
				this.props.children
			)
		);
	}
});