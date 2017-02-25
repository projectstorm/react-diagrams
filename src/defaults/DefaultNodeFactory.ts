import {NodeWidgetFactory} from "../WidgetFactories";
import {DefaultNodeModel} from "./DefaultNodeModel";
import * as React from "react";
import {DefaultNodeWidget} from "./DefaultNodeWidget";
import {DiagramEngine} from "../DiagramEngine";
/**
 * @author Dylan Vorster
 */
export class DefaultNodeFactory extends NodeWidgetFactory{
	
	constructor(){
		super("default");
	}
	
	generateModel(){
		
	}
	
	generateReactWidget(diagramEngine:DiagramEngine,node: DefaultNodeModel): JSX.Element{
		return React.createElement(DefaultNodeWidget,{
			node: node,
			diagramEngine: diagramEngine
		});
	}
}