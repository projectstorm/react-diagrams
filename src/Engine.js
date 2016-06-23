var _ = require("lodash");
var React = require("react");
/**
 * @author Dylan Vorster
 */
module.exports = function(){
	return {
		state:{
			links:{},
			nodes:{},
			factories: {},
			canvas: null,
			offsetX:0,
			offsetY:0,
			zoom: 100,
			listeners:{},
			selectedLink: null,
			selectedNode: null,
			
			updatingNodes: null,
			updatingLinks: null
		},
		
		repaintLinks: function(links){
			this.state.updatingNodes = {};
			this.state.updatingLinks = {};
			links.forEach(function(link){
				this.state.updatingLinks[link.id] = link;
			}.bind(this));
			this.update();
		},
		
		repaintNodes: function(nodes){
			this.state.updatingNodes = {};
			this.state.updatingLinks = {};
			
			//store the updating node is's
			nodes.forEach(function(node){
				this.state.updatingNodes[node.id] = node;
				this.getNodeLinks(node).forEach(function(link){
					this.state.updatingLinks[link.id] = link;
				}.bind(this));
			}.bind(this));
			
			this.update();
		},
		
		update: function(){
			this.fireEvent({type:'repaint'});
		},
		
		getRelativeMousePoint: function(event){
			var point = this.getRelativePoint(event.pageX,event.pageY);
			return {
				x:(point.x/(this.state.zoom/100.0))-this.state.offsetX,
				y:(point.y/(this.state.zoom/100.0))-this.state.offsetY
			};
		},
		
		getRelativePoint: function(x,y){
			var canvasRect = this.state.canvas.getBoundingClientRect();
			return {x: x-canvasRect.left,y:y-canvasRect.top};
		},
		
		fireEvent: function(event){
			_.forEach(this.state.listeners,function(listener){
				listener(event);
			});
		},
		
		removeListener: function(id){
			delete this.state.listeners[id];
		},
		
		registerListener: function(cb){
			var id = this.UID();
			this.state.listeners[id] = cb;
			return id;
		},
		
		setZoom: function(zoom){
			this.state.zoom = zoom;
			this.update();
		},
		
		setOffset: function(x,y){
			this.state.offsetX = x;
			this.state.offsetY = y;
			this.update();
		},
		
		loadModel: function(model){
			this.state.links = {};
			this.state.node = {};

			model.nodes.forEach(function(node){
				this.addNode(node);
			}.bind(this));

			model.links.forEach(function(link){
				this.addLink(link);
			}.bind(this));
		},
		
		
		
		updateNode: function(node){
			
			//find the links and move those as well
			this.getNodeLinks(node);
			this.fireEvent({type:'repaint'});
		},

		UID: function(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		},
		
		getNodePortElement: function(node,port){
			return this.state.canvas.querySelector('.port[data-name="'+port+'"][data-nodeid="'+node.id+'"]')
		},

		getAllConnectedPorts: function(node){
			return this.state.canvas.querySelectorAll('.port[data-nodeid="'+node.id+'"]');
		},
		
		getNodeLinks: function(node){
			return _.values(_.filter(this.state.links,function(link,index){
				return link.source == node.id || link.target == node.id;
			}));
		},
		
		removeLink: function(link){
			delete this.state.links[link.id];
			this.update();
		},
		
		removeNode: function(node){
			//remove the links 
			var links = this.getNodeLinks(node);
			links.forEach(function(link){
				this.removeLink(link);
			}.bind(this));
			
			//remove the node
			delete this.state.nodes[node.id];
			this.update();
		},
		
		getPortCenter: function(node,port){
			var sourceElement = this.getNodePortElement(node,port);
			var sourceRect = sourceElement.getBoundingClientRect();
			
			var rel = this.getRelativePoint(sourceRect.left,sourceRect.top);

			return {
				x: ((sourceElement.offsetWidth/2)+rel.x/(this.state.zoom/100.0)) -(this.state.offsetX),
				y: ((sourceElement.offsetHeight/2)+rel.y/(this.state.zoom/100.0)) -(this.state.offsetY)
			};
		},
		
		setSelectedNode: function(node){
			this.state.selectedLink = null;
			this.state.selectedNode = node;
			this.state.updatingNodes =  null;
			this.state.updatingLinks = null;
			this.update();
		},
		
		setSelectedLink: function(link){
			this.state.selectedNode = null;
			this.state.selectedLink = link;
			this.state.updatingNodes = null;
			this.state.updatingLinks = null;
			this.update();
		},

		addLink: function(link){
			var FinalLink = _.defaults(link,{
				id: this.UID(),
				source: null,
				sourcePort: null,
				target: null, 
				targetPort: null,
				points: []
			});
		
			this.state.links[FinalLink.id] = FinalLink;
			return FinalLink;
		},

		addNode: function(node,event){
			var point = {x:0,y:0};
			if(event !== undefined){
				point = this.getRelativeMousePoint(event);
			}
			
			var FinalNode = _.defaults(node,{
				id: this.UID(),
				type: 'default',
				data:{},
				x: point.x,
				y: point.y
			});
			this.state.nodes[FinalNode.id] = FinalNode;
		},
		
		getLink: function(id){
			return this.state.links[id];
		},
		
		getNode: function(id){
			return this.state.nodes[id];
		},
		
		getNodeFactory: function(type){
			if(this.state.factories[type] === undefined){
				throw "Cannot find node factory for: "+type;
			}
			return this.state.factories[type];
		},

		registerNodeFactory: function(factory){
			var FinalModel = _.defaults(factory,{
				type: "factoty",
				generateModel: function(model){
					return null;
				}
			});
			this.state.factories[FinalModel.type] = FinalModel;
		}
	};
};