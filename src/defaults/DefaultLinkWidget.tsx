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

		let x = this.props.diagramEngine.getDiagramModel().getGridPosition(this.props.link.points[pointIndex].x);
		let y = this.props.diagramEngine.getDiagramModel().getGridPosition(this.props.link.points[pointIndex].y);

		return (
			<g key={'point-'+this.props.link.points[pointIndex].id}>
				<circle
					cx={x} cy={y} r={5}
					className={'point pointui' + (this.props.link.points[pointIndex].isSelected()?' selected':'')} />
				<circle
					onMouseLeave={() => {
						this.setState({selected: false});
					}}
					onMouseEnter={() => {
						this.setState({selected: true});
					}}
					data-id={this.props.link.points[pointIndex].id}
					data-linkid={this.props.link.id}
					cx={x} cy={y} r={15}
					opacity={0}
					className={'point'} />
			</g>
		);
	}

	generateLink(extraProps: any, id: string|number): JSX.Element{
		var Bottom = (
			<path
				className={(this.state.selected || this.props.link.isSelected())?'selected':''}
				strokeWidth={this.props.width}
				stroke={this.props.color}
				{...extraProps}
			/>
		);

		var Top = (
			<path
				strokeLinecap="round"
				onMouseLeave={() => {
					this.setState({selected: false});
				}}
				onMouseEnter={() => {
					this.setState({selected: true});
				}}
				data-linkid={this.props.link.getID()}
				stroke={this.props.color}
				strokeOpacity={this.state.selected?0.1:0}
				strokeWidth={20}
				onContextMenu={() =>{
					if(!this.props.diagramEngine.isModelLocked(this.props.link)){
						event.preventDefault();
						this.props.link.remove();
					}
				}}
				{...extraProps}
			/>
		);

		return (
			<g key={'link-'+id}>{Bottom}{Top}</g>
		);
	}

	render() {
		//ensure id is present for all points on the path
		var points = this.props.link.points;
		var paths = [];
		let model = this.props.diagramEngine.getDiagramModel();

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
				onMouseDown: (event) =>{
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
			},"0"));
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
					if(i === 0){
						ds.push(" M "+points[i].x+" "+points[i].y+" L "+model.getGridPosition(points[i+1].x)+" "+model.getGridPosition(points[i+1].y));
					}else if(i === points.length-1){
						ds.push(" M "+model.getGridPosition(points[i].x)+" "+model.getGridPosition(points[i].y)+" L "+model.getGridPosition(points[i+1].x)+" "+model.getGridPosition(points[i+1].y));
					}else{
						ds.push(" M "+model.getGridPosition(points[i].x)+" "+model.getGridPosition(points[i].y)+" L "+points[i+1].x+" "+points[i+1].y);
					}
				}
			}

			paths = ds.map((data,index) => {
				return this.generateLink({
					'data-linkid':this.props.link.id,
					'data-point':index,
					onMouseDown: (event: MouseEvent) => {
						if (!event.shiftKey && !this.props.diagramEngine.isModelLocked(this.props.link)){
							var point = new PointModel(this.props.link,this.props.diagramEngine.getRelativeMousePoint(event));
							point.setSelected(true);
							this.forceUpdate();
							this.props.link.addPoint(point,index+1);
							this.props.pointAdded(point,event);
						}
					},
					d:data
				},index);
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
			<g>{paths}</g>
		);
	}
}