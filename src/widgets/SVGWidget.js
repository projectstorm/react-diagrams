var React = require("react");
var LinkWidget = require("./LinkWidget");
var _ = require("lodash");
/**
 * @author Dylan Vorster
 */
module.exports = React.createClass({
	displayName: "SVG Widget",
	getInitialState: function () {
		return {
		};
	},
	getDefaultProps: function () {
		return {
			engine: null,
			newPoint: function(link,pointID){
				
			}
		};
	},
	render: function () {
		return (
			React.DOM.svg({},
				_.map(this.props.engine.state.links,function(link){
					if(link.points.length < 2){
						return;
					}else{
						if(link.source !== null){
							link.points[0] = this.props.engine.getPortCenter(this.props.engine.getNode(link.source),link.sourcePort);
						}
						if(link.target !== null){
							link.points[link.points.length-1] = this.props.engine.getPortCenter(this.props.engine.getNode(link.target),link.targetPort);
						}
					}
					
					return React.createElement(LinkWidget,{
						key: link.id,
						newPoint: function(pointID){
							this.props.newPoint(link,pointID);
						}.bind(this),
						link: link,
						engine: this.props.engine
					});
				}.bind(this))
			)
		);
	}
});