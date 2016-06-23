var React = require("react");
var Port = require("./PortWidget");
var _ = require("lodash");
//var m = require("../merge");
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
		
		var props = {
			
		};
		
		return (
			React.DOM.div({className:'basic-node', style: {background:this.props.color }},
				React.DOM.div({className:'title'},
					React.DOM.div({className:'name'},this.props.name),
					React.DOM.div({className:'fa fa-close',onClick: this.props.removeAction})
				),
				React.DOM.div({className:'ports'},
					React.DOM.div({className:'in'},(Array.isArray(this.props.inPorts)?this.props.inPorts:[this.props.inPorts]).map(function(port){
						var portName = "";
						var displayName = "";
						if(typeof port === 'object'){
							portName = port.name;
							displayName = port.display;
						}else{
							portName = port;
							displayName = port;
						}
						return React.DOM.div({className:'in-port',key: portName},
							React.createElement(Port,{name:portName,node:this.props.node}),
							React.DOM.div({className:'name'},displayName)
						);
					}.bind(this))),
					React.DOM.div({className:'out'},(Array.isArray(this.props.outPorts)?this.props.outPorts:[this.props.outPorts]).map(function(port){
						var portName = "";
						var displayName = "";
						if(typeof port === 'object'){
							portName = port.name;
							displayName = port.display;
						}else{
							portName = port;
							displayName = port;
						}
						return React.DOM.div({className:'out-port',key: portName},
							React.DOM.div({className:'name'},displayName),
							React.createElement(Port,{name:portName,node:this.props.node})
						);
					}.bind(this)))
				)
			)
		);
	}
});