import {NodeModel} from "../Common";
import {DefaultPortModel} from "./DefaultPortModel";
import * as _ from "lodash";
/**
 * @author Dylan Vorster
 */
export class DefaultNodeModel extends NodeModel{
	
	name: string;
	color: string;
	ports:  {[s: string]:DefaultPortModel};
	
	constructor(name: string = 'Untitled',color: string = 'rgb(0,192,255)'){
		super("default");
		this.name = name;
		this.color = color;
	}
	
	getInPorts(): DefaultPortModel[]{
		return _.filter(this.ports,(portModel) => {
			return portModel.in;
		});
	}
	
	getOutPorts(): DefaultPortModel[]{
		return _.filter(this.ports,(portModel) => {
			return !portModel.in;
		});
	}
}