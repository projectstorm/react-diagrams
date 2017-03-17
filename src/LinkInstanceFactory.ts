import {LinkModel} from "./Common";
import * as _ from "lodash";
import {AbstractInstanceFactory} from "./AbstractInstanceFactory";
/**
 * @author Dylan Vorster
 */
export class LinkInstanceFactory extends AbstractInstanceFactory<LinkModel>{
	
	constructor(){
		super("LinkModel");
	}
	
	getInstance(){
		return new LinkModel();
	}
}