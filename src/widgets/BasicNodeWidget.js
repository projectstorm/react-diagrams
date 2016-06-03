var React = require("react");
var Port = require("./PortWidget");
/**
 * @author Dylan Vorster
 */
module.exports = React.createClass({
	displayName: "BasicNodeWidget",
	getInitialState: function () {
		return {
		};
	},
	getDefaultProps: function () {
		return {
			name: "Node",
			node: null,
			inPorts:[],
			outPorts: [],
			color: 'rgb(50,50,50)',
			removeAction: function(){
				console.log("remove node");
			}
		};
	},
	render: function () {
		return (
			React.DOM.div({className:'basic-node', style: {background:this.props.color }},
				React.DOM.div({className:'title'},
					React.DOM.div({className:'name'},this.props.name),
					React.DOM.div({className:'fa fa-close',onClick: this.props.removeAction})
				),
				React.DOM.div({className:'ports'},
					React.DOM.div({className:'in'},this.props.inPorts.map(function(port){
						return React.DOM.div({className:'in-port'},
							React.createElement(Port,{name:port,node:this.props.node}),
							React.DOM.div({className:'name'},port)
						);
					}.bind(this))),
					React.DOM.div({className:'out'},this.props.outPorts.map(function(port){
						return React.DOM.div({className:'out-port'},
							React.DOM.div({className:'name'},port),
							React.createElement(Port,{name:port,node:this.props.node})
						);
					}.bind(this)))
				)
			)
		);
	}
});