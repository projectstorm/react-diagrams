import * as React from "react";
import {LinkModel, PointModel} from "../Common";
import * as _ from "lodash";
import {DiagramEngine} from "../DiagramEngine";

export interface DefaultLinkProps {
	color?: string;
	width?: number;
	link: LinkModel;
	smooth?: boolean;
	diagramEngine: DiagramEngine;
	pointAdded?: (point: PointModel,event) => any
}

export interface DefaultLinkState {
	selected: boolean;
}

/**
 * @author Dylan Vorster
 */
export class DefaultLinkWidget extends React.Component<DefaultLinkProps, DefaultLinkState> {

	public static defaultProps: DefaultLinkProps = {
		color: 'black',
		width: 3,
		link:null,
		engine: null,
		smooth: false,
		diagramEngine: null
	};

	constructor(props: DefaultLinkProps) {
		super(props);
		this.state = {
			selected: false
		}
	}
	
	generatePoint(pointIndex: number): JSX.Element{
		return React.DOM.g({key:'point-'+this.props.link.points[pointIndex].id},
			React.DOM.circle({
				className: 'point pointui' + (this.props.link.points[pointIndex].isSelected()?' selected':''),
				cx:this.props.link.points[pointIndex].x,
				cy:this.props.link.points[pointIndex].y,
				r:5,
			}),
			React.DOM.circle({
				className:'point',
				'data-linkid':this.props.link.id,
				'data-id':this.props.link.points[pointIndex].id,
				cx: this.props.link.points[pointIndex].x,
				cy:this.props.link.points[pointIndex].y,
				r:15,
				opacity: 0,
				onMouseLeave:() => {
					this.setState({selected: false});
				},
				onMouseEnter:() => {
					this.setState({selected: true});
				},
			})
		);
	}
	
	generateLink(extraProps: {id: number}): JSX.Element{
		var Bottom = React.DOM.path(_.merge({
			className: (this.state.selected || this.props.link.isSelected())?'selected':'',
			strokeWidth:this.props.width,
			stroke: this.props.color
		},extraProps));
		
		var Top = React.DOM.path(_.merge({
			strokeLinecap:'round' as 'round',
			onMouseLeave:() => {
				this.setState({selected: false});
			},
			onMouseEnter:() => {
				this.setState({selected: true});
			},
			'data-linkid': this.props.link.getID(),
			stroke: this.props.color,
			strokeOpacity:this.state.selected?0.1:0 ,
			strokeWidth: 20,
			onContextMenu: (event) => {
				event.preventDefault();
				if (!this.props.diagramEngine.isModelLocked(this.props.link)) {
					this.props.link.remove();
				}
			},
		},extraProps));
		
		return React.DOM.g({key:'link-'+extraProps.id},
			Bottom,Top
		);
	}

	render() {
		//ensure id is present for all points on the path
		var points = this.props.link.points;
		var paths = [];
        
        //draw the smoothing
		if(points.length === 2){
			
            //if the points are too close, just draw a straight line
			var margin = 50;
			if(Math.abs(points[0].x-points[1].x) < 50){
				margin = 5;
			}
            
            var pointLeft = points[0];
            var pointRight = points[1];
            
            //some defensive programming to make sure the smoothing is
            //always in the right direction
            if(pointLeft.x > pointRight.x){
                pointLeft = points[1];
                pointRight = points[0];
            }
			
			paths.push(this.generateLink({
				id: 0,
				onMouseDown: (event: MouseEvent) =>{
					event.preventDefault();
					if (!event.shiftKey && !this.props.diagramEngine.isModelLocked(this.props.link)){
						var point = new PointModel(this.props.link,this.props.diagramEngine.getRelativeMousePoint(event));
						point.setSelected(true);
						this.forceUpdate();
						this.props.link.addPoint(point,1);
						this.props.pointAdded(point,event);
					}
				},
				d:
					 " M"+pointLeft.x+" "+pointLeft.y
					+" C"+(pointLeft.x+margin)+" "+pointLeft.y
					+" " +(pointRight.x-margin)+" "+pointRight.y
					+" " +pointRight.x+" "+pointRight.y
			}));
			if (this.props.link.targetPort === null){
				paths.push(this.generatePoint(1));
			}
		}
        
        //draw the multiple anchors and complex line instead
        else{
			var ds = [];
			if(this.props.smooth){
				ds.push(" M"+points[0].x+" "+points[0].y+" C "+(points[0].x+50)+" "+points[0].y+" "+points[1].x+" "+points[1].y+" "+points[1].x+" "+points[1].y);
				for(var i = 1;i < points.length-2;i++){
					ds.push(" M "+points[i].x+" "+points[i].y+" L "+points[i+1].x+" "+points[i+1].y);
				}
				ds.push(" M"+points[i].x+" "+points[i].y+" C "+points[i].x+" "+points[i].y+" "+(points[i+1].x-50)+" "+points[i+1].y+" "+points[i+1].x+" "+points[i+1].y);
			}else{
				var ds = [];
				for(var i = 0;i < points.length-1;i++){
					ds.push(" M "+points[i].x+" "+points[i].y+" L "+points[i+1].x+" "+points[i+1].y);
				}
			}
			
			paths = ds.map((data,index) => {
				return this.generateLink({
					id:index,
					'data-linkid':this.props.link.id,
					'data-point':index,
					onMouseDown: (event: MouseEvent) => {
						event.preventDefault();
						if (!event.shiftKey && !this.props.diagramEngine.isModelLocked(this.props.link)){
							var point = new PointModel(this.props.link,this.props.diagramEngine.getRelativeMousePoint(event));
							point.setSelected(true);
							this.forceUpdate();
							this.props.link.addPoint(point,index+1);
							this.props.pointAdded(point,event);
						}
					},
					d:data
				});
			});
			
			//render the circles
			for(var i = 1;i < points.length-1;i++){
				paths.push(this.generatePoint(i));
			}
			
			if (this.props.link.targetPort === null){
				paths.push(this.generatePoint(points.length-1));
			}
		}
		
		return (
			React.DOM.g(null,paths)
		);
	}
}