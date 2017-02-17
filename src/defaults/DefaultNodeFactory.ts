import {NodeWidgetFactory} from "../WidgetFactories";
import {NodeModel} from "../Common";
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
	
	generateReactWidget(diagramEngine:DiagramEngine,node: NodeModel): JSX.Element{
		return React.createElement(DefaultNodeWidget,{
			node: node,
			diagramEngine: diagramEngine,
			name: node.extras['name'],
			inPorts: node.extras['inPorts'],
			outPorts: node.extras['outPorts'],
		});
	}
}