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
	
	componentDidMount: function(){
		this.props.engine.registerListener(function(event){
			if(event.type === 'repaint'){
				this.forceUpdate();
			}
		}.bind(this));
	},
	
	render: function () {
		return (
			React.DOM.div({
					className:'node-view',
					style:{
						transform: 'scale('+this.props.engine.state.zoom/100.0+') translate('+this.props.engine.state.offsetX+'px,'+this.props.engine.state.offsetY+'px)',
						width: '100%',
						height: '100%'
					}
				},
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