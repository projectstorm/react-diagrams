import { BaseModel, BaseModelListener } from "./BaseModel";
import { NodeModel } from "./NodeModel";
import { LinkModel } from "./LinkModel";
import * as _ from "lodash";

export class PortModel extends BaseModel<BaseModelListener> {
	name: string;
	parentNode: NodeModel;
	links: { [id: string]: LinkModel };
	maximumLinks: number;

	constructor(name: string, type?: string, id?: string, maximumLinks?: number) {
		super(type, id);
		this.name = name;
		this.links = {};
		this.parentNode = null;
		this.maximumLinks = maximumLinks;
	}

	deSerialize(ob) {
		super.deSerialize(ob);
		this.name = ob.name;
		this.maximumLinks = ob.maximumLinks;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
			parentNode: this.parentNode.id,
			links: _.map(this.links, link => {
				return link.id;
			}),
			maximumLinks: this.maximumLinks
		});
	}

	doClone(lookupTable = {}, clone) {
		clone.links = {};
		clone.parentNode = this.parentNode.clone(lookupTable);
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

	getMaximumLinks(): number {
		return this.maximumLinks;
	}

	setMaximumLinks(maximumLinks: number) {
		this.maximumLinks = maximumLinks;
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
		if (_.isFinite(this.maximumLinks)) {
			var numberOfLinks: number = _.size(this.links);
			if (this.maximumLinks === 1 && numberOfLinks >= 1) {
				return _.values(this.links)[0];
			} else if (numberOfLinks >= this.maximumLinks) {
				return null;
			}
		}

		var linkModel = new LinkModel();
		linkModel.setSourcePort(this);
		return linkModel;
	}

	canLinkToPort(port: PortModel): boolean {
		return true;
	}

	isLocked() {
		return super.isLocked() || this.getParent().isLocked();
	}
}
