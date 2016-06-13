var React = require("react");
var _ = require("lodash");
/**
 * @author Dylan Vorster
 */
module.exports = React.createClass({
	displayName: "LinkWidget",
	getInitialState: function(){
		return {
			selected: false,
		};
	},
	getDefaultProps: function () {
		return {
			width: 3,
			link:null,
			engine: null,
			smooth: false,
			newPoint: function(id){
				
			}
		};
	},
	
	getPoint: function(index){
		if(index === 0){
			return this.props.link.points[index];
		}
		if(this.props.link.target !== null && index === this.props.link.points.length-1){
			return this.props.link.points[index];
		}
		return {
			x: this.props.link.points[index].x+this.props.engine.state.offsetX,
			y: this.props.link.points[index].y+this.props.engine.state.offsetY
		};
	},
	
	setSelected: function(selected){
		this.setState({selected: selected});
		if(selected){
			this.props.engine.setSelectedLink(selected?this.props.link:null);
		}
	},
	
	generatePoint: function(pointIndex){
		return React.DOM.g({key:'point-'+this.props.link.points[pointIndex].id},
			React.DOM.circle({
				className:'point pointui',
				cx:this.getPoint(pointIndex).x,
				cy:this.getPoint(pointIndex).y,
				r:5,
			}),
			React.DOM.circle({
				className:'point',
				'data-linkid':this.props.link.id,
				'data-id':this.props.link.points[pointIndex].id,
				cx:this.getPoint(pointIndex).x,
				cy:this.getPoint(pointIndex).y,
				r:15,
				opacity: 0,
				onMouseLeave: function(){
					this.setSelected(false);
				}.bind(this),
				onMouseEnter: function(){
					this.setSelected(true);
				}.bind(this)
			})
		);
	},
	
	generateLink: function(extraProps){
		var Bottom = React.DOM.path(_.merge({
			className:this.state.selected?'selected':'',
			strokeWidth:this.props.width,
			stroke:'black'
		},extraProps));
		
		var Top = React.DOM.path(_.merge({
			onMouseLeave: function(){
				this.setSelected(false);
			}.bind(this),
			onMouseEnter: function(){
				this.setSelected(true);
			}.bind(this),
			strokeOpacity:0,
			strokeWidth: 20,
			onContextMenu: function(event){
				event.preventDefault();
				this.props.engine.removeLink(this.props.link);
			}.bind(this),
		},extraProps));
		
		return React.DOM.g({key:'link-'+extraProps.id},
			Bottom,
			Top
		);
	},
	
	render: function () {
		var points = this.props.link.points;
		points.forEach(function(point){
			if(point.id === undefined){
				point.id = this.props.engine.UID();
			}
		}.bind(this));
		var paths = [];
		if(points.length === 2){
			paths.push(this.generateLink({
				id: '0',
				onMouseDown: function(event){
					var point = this.props.engine.getRelativeMousePoint(event);
					point.id = this.props.engine.UID();
					this.props.link.points.splice(1,0,point);
					this.forceUpdate();
					this.props.newPoint(point.id);
				}.bind(this),
				d:
					 " M"+this.getPoint(0).x+" "+this.getPoint(0).y
					+" C"+(this.getPoint(0).x+50)+" "+this.getPoint(0).y
					+" " +(this.getPoint(1).x-50)+" "+this.getPoint(1).y
					+" " +this.getPoint(1).x+" "+this.getPoint(1).y
			}));
			if(this.props.link.target === null){
				paths.push(this.generatePoint(1));
			}
		}else{
			var ds = [];
			if(this.props.smooth){
				ds.push(" M"+this.getPoint(0).x+" "+this.getPoint(0).y+" C "+(this.getPoint(0).x+50)+" "+this.getPoint(0).y+" "+this.getPoint(1).x+" "+this.getPoint(1).y+" "+this.getPoint(1).x+" "+this.getPoint(1).y);
				for(var i = 1;i < points.length-2;i++){
					ds.push(" M "+this.getPoint(i).x+" "+this.getPoint(i).y+" L "+this.getPoint(i+1).x+" "+this.getPoint(i+1).y);
				}
				ds.push(" M"+this.getPoint(i).x+" "+this.getPoint(i).y+" C "+this.getPoint(i).x+" "+this.getPoint(i).y+" "+(this.getPoint(i+1).x-50)+" "+this.getPoint(i+1).y+" "+this.getPoint(i+1).x+" "+this.getPoint(i+1).y);
			}else{
				var ds = [];
				for(var i = 0;i < points.length-1;i++){
					ds.push(" M "+this.getPoint(i).x+" "+this.getPoint(i).y+" L "+this.getPoint(i+1).x+" "+this.getPoint(i+1).y);
				}
			}
			
			paths = ds.map(function(data,index){
				return this.generateLink({
					id:index,
					'data-link':this.props.link.id,
					'data-point':index,
					onMouseDown: function(event){
						var point = this.props.engine.getRelativeMousePoint(event);
						point.id = this.props.engine.UID();
						this.props.link.points.splice(index+1,0,point);
						this.forceUpdate();
						this.props.newPoint(point.id);
					}.bind(this),
					d:data
				});
			}.bind(this));
			
			
			//render the circles
			for(var i = 1;i < points.length-1;i++){
				paths.push(this.generatePoint(i));
			}
			
			if(this.props.link.target === null){
				paths.push(this.generatePoint(points.length-1));
			}
		}
		
		
		return (
			React.DOM.g(null,	paths)
		);
	}
});