var React = require("react");
var ReactDOM = require("react-dom");
var Canvas = require("../src/widgets/CanvasWidget");
var BasicNodeWidget = require("../src/widgets/BasicNodeWidget");
require("./test.scss");

window.onload = function () {
	
	var Engine = require("../src/Engine")();

	var Model = {
		links:[
			{
				id: 1,
				source: 1,
				sourcePort: 'out',
				target: 2,
				targetPort: 'in',
			},
			{
				id: 2,
				source: 1,
				sourcePort: 'out',
				target: 3,
				targetPort: 'in'
			},
			{
				id: 3,
				source: 2,
				sourcePort: 'out',
				target: 4,
				targetPort: 'in'
			},
			{
				id: 4,
				source: 4,
				sourcePort: 'out',
				target: 5,
				targetPort: 'in2'
			},
			{
				id: 5,
				source: 2,
				sourcePort: 'out',
				target: 5,
				targetPort: 'in'
			}
		],
		nodes:[
			{
				id:1,
				type: 'action',
				data: {
					name: "Create User",
					outVariables: ['out']
				},
				x:50,
				y:50
			},
			{
				id:2,
				type: 'action',
				data: {
					name: "Add Card to User",
					inVariables: ['in','in 2'],
					outVariables: ['out']
				},
				x:250,
				y:50
			},
			{
				id:3,
				type: 'action',
				data: {
					color: 'rgb(0,192,255)',
					name: "Remove User",
					inVariables: ['in']
				},
				x:250,
				y:150
			},
			{
				id:4,
				type: 'action',
				data: {
					color: 'rgb(0,192,255)',
					name: "Remove User",
					inVariables: ['in'],
					outVariables: ['out']
				},
				x:500,
				y:150
			},
			{
				id:5,
				type: 'action',
				data: {
					color: 'rgb(192,255,0)',
					name: "Complex Action 2",
					inVariables: ['in','in2','in3']
				},
				x:800,
				y:100
			},
		]
	};

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

	Engine.loadModel(Model);


	ReactDOM.render(React.createElement(Canvas,{engine: Engine}), document.body);
};
