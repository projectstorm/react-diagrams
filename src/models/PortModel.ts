import { BaseModel, BaseModelListener } from "./BaseModel";
import { NodeModel } from "./NodeModel";
import { LinkModel } from "./LinkModel";
import * as _ from "lodash";
import {DefaultLinkModel} from "../defaults/models/DefaultLinkModel";
import {DiagramEngine} from "../DiagramEngine";

export abstract class PortModel extends BaseModel<NodeModel,BaseModelListener> {
	name: string;
	links: { [id: string]: LinkModel };

	constructor(name: string, type?: string, id?: string) {
		super(type, id);
		this.name = name;
		this.links = {};
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.name = ob.name;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
			parentNode: this.parent.id,
			links: _.map(this.links, link => {
				return link.id;
			})
		});
	}

	doClone(lookupTable = {}, clone) {
		clone.links = {};
		clone.parentNode = this.getParent().clone(lookupTable);
	}

	getNode(): NodeModel{
		return this.getParent();
	}

	getName(): string {
		return this.name;
	}

	removeLink(link: LinkModel) {
		delete this.links[link.getID()];
	}

	addLink(link: LinkModel) {
		this.links[link.getID()] = link;
	}

	getLinks(): { [id: string]: LinkModel } {
		return this.links;
	}

	abstract createLinkModel(): LinkModel;

	isLocked() {
		return super.isLocked() || this.getParent().isLocked();
	}
}
