var React = require("react");
var ReactDOM = require("react-dom");
var Canvas = require("../src/widgets/CanvasWidget");
var BasicNodeWidget = require("../src/widgets/BasicNodeWidget");
require("./test.scss");

window.onload = function () {
	
	var Engine = require("../src/Engine")();
	
	var model = {links:[],nodes: []};
	
	function generateSet(model,offsetX,offsetY){
		
		var node1 = Engine.UID();
		var node2 = Engine.UID();
		var node3 = Engine.UID();
		var node4 = Engine.UID();
		var node5 = Engine.UID();
		
		
		model.links = model.links.concat([
			{
				id: Engine.UID(),
				source: node1,
				sourcePort: 'out',
				target: node2,
				targetPort: 'in',
			},
			{
				id: Engine.UID(),
				source: node1,
				sourcePort: 'out',
				target: node3,
				targetPort: 'in'
			},
			{
				id: Engine.UID(),
				source: node2,
				sourcePort: 'out',
				target: node4,
				targetPort: 'in'
			},
			{
				id: Engine.UID(),
				source: node4,
				sourcePort: 'out',
				target: node5,
				targetPort: 'in2'
			},
			{
				id: Engine.UID(),
				source: node2,
				sourcePort: 'out',
				target: node5,
				targetPort: 'in'
			}
		]);
		
		model.nodes = model.nodes.concat([
		{
				id:node1,
				type: 'action',
				data: {
					name: "Create User",
					outVariables: ['out']
				},
				x:50 + offsetX,
				y:50 + offsetY
			},
			{
				id:node2,
				type: 'action',
				data: {
					name: "Add Card to User",
					inVariables: ['in','in 2'],
					outVariables: ['out']
				},
				x:250 +offsetX,
				y:50 + offsetY
			},
			{
				id:node3,
				type: 'action',
				data: {
					color: 'rgb(0,192,255)',
					name: "Remove User",
					inVariables: ['in']
				},
				x:250 + offsetX,
				y:150 + offsetY
			},
			{
				id:node4,
				type: 'action',
				data: {
					color: 'rgb(0,192,255)',
					name: "Remove User",
					inVariables: ['in'],
					outVariables: ['out']
				},
				x:500 + offsetX,
				y:150 + offsetY
			},
			{
				id:node5,
				type: 'action',
				data: {
					color: 'rgb(192,255,0)',
					name: "Complex Action 2",
					inVariables: ['in','in2','in3']
				},
				x:800 + offsetX,
				y:100 + offsetY
			},
		]);
	}
	
	generateSet(model,0,0);
	generateSet(model,800,0);
	generateSet(model,1600,0);
	generateSet(model,2400,0);
	
	generateSet(model,0,300);
	generateSet(model,800,300);
	generateSet(model,1600,300);
	generateSet(model,2400,300);
	
	generateSet(model,0,600);
	generateSet(model,800,600);
	generateSet(model,1600,600);
	generateSet(model,2400,600);
	
	generateSet(model,0,900);
	generateSet(model,800,900);
	generateSet(model,1600,900);
	generateSet(model,2400,900);


	Engine.registerNodeFactory({
		type:'action',
		generateModel: function(model){
			return React.createElement(BasicNodeWidget,{
				removeAction: function(){
					Engine.removeNode(model);
				},
				color: model.data.color,
				node: model,
				name: model.data.name,
				inPorts: model.data.inVariables,
				outPorts: model.data.outVariables
			});
		}
	});

	Engine.loadModel(model);


	ReactDOM.render(React.createElement(Canvas,{engine: Engine}), document.body);
};
