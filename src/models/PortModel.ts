import { BaseModel, BaseModelListener } from "./BaseModel";
import { NodeModel } from "./NodeModel";
import { LinkModel } from "./LinkModel";
import * as _ from "lodash";

export class PortModel extends BaseModel<BaseModelListener> {
	name: string;
	parentNode: NodeModel;
	links: { [id: string]: LinkModel };

	// calculated post rendering so routing can be done correctly
	x: number;
	y: number;
	width: number;
	height: number;

	constructor(name: string, type?: string, id?: string) {
		super(type, id);
		this.name = name;
		this.links = {};
		this.parentNode = null;
	}

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

	updateCoords({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	createLinkModel(): LinkModel | null {
		var linkModel = new LinkModel();
		linkModel.setSourcePort(this);
		return linkModel;
	}

	isLocked() {
		return super.isLocked() || this.getParent().isLocked();
	}
}
