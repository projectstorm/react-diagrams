import { BaseModel, BaseModelListener } from "./BaseModel";
import { NodeModel } from "./NodeModel";
import { LinkModel } from "./LinkModel";
import * as _ from "lodash";

export class PortModel extends BaseModel<BaseModelListener> {
	name: string;
	parentNode: NodeModel;
	links: { [id: string]: LinkModel };

	deSerialize(ob) {
		super.deSerialize(ob);
		this.name = ob.name;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
			parentNode: this.parentNode.id,
			links: _.map(this.links, link => {
				return link.id;
			})
		});
	}

	doClone(lookupTable = {}, clone) {
		clone.links = {};
		clone.parentNode = this.parentNode.clone(lookupTable);
	}

	constructor(name: string, id?: string) {
		super(id);
		this.name = name;
		this.links = {};
		this.parentNode = null;
	}

	getName(): string {
		return this.name;
	}

	getParent(): NodeModel {
		return this.parentNode;
	}

	setParentNode(node: NodeModel) {
		this.parentNode = node;
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

	createLinkModel(): LinkModel | null {
		var linkModel = new LinkModel();
		linkModel.setSourcePort(this);
		return linkModel;
	}
}
