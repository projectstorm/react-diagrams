import { AbstractInstanceFactory } from "./AbstractInstanceFactory";
import {LinkModel} from "./models/LinkModel";
/**
 * @author Dylan Vorster
 */
export class LinkInstanceFactory extends AbstractInstanceFactory<LinkModel> {
	constructor() {
		super("LinkModel");
	}

	getInstance() {
		return new LinkModel();
	}
}
