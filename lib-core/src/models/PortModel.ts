import { BaseModel, BaseModelGenerics, BaseModelOptions } from '../core-models/BaseModel';
import { NodeModel } from './NodeModel';
import { LinkModel } from './LinkModel';
import * as _ from 'lodash';
import { DiagramEngine } from '../DiagramEngine';
import { BasePositionModel } from '../core-models/BasePositionModel';

export enum PortModelAlignment {
	TOP = 'top',
	LEFT = 'left',
	BOTTOM = 'bottom',
	RIGHT = 'right'
}

export interface PortModelOptions extends BaseModelOptions {
	alignment?: PortModelAlignment;
	maximumLinks?: number;
	name: string;
}

export interface PortModelGenerics extends BaseModelGenerics {
	OPTIONS: PortModelOptions;
	PARENT: NodeModel;
}

export class PortModel<G extends PortModelGenerics = PortModelGenerics> extends BasePositionModel<G> {
	links: { [id: string]: LinkModel };

	// calculated post rendering so routing can be done correctly
	width: number;
	height: number;

	constructor(options: G['OPTIONS']) {
		super(options);
		this.links = {};
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
	}

	serialize() {
		return {
			...super.serialize(),
			parentNode: this.parent.getID(),
			links: _.map(this.links, link => {
				return link.getID;
			})
		};
	}

	doClone(lookupTable = {}, clone) {
		clone.links = {};
		clone.parentNode = this.getParent().clone(lookupTable);
	}

	getNode(): NodeModel {
		return this.getParent();
	}

	getName(): string {
		return this.options.name;
	}

	getMaximumLinks(): number {
		return this.options.maximumLinks;
	}

	setMaximumLinks(maximumLinks: number) {
		this.options.maximumLinks = maximumLinks;
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

	public createLinkModel(): LinkModel | null {
		if (_.isFinite(this.options.maximumLinks)) {
			var numberOfLinks: number = _.size(this.links);
			if (this.options.maximumLinks === 1 && numberOfLinks >= 1) {
				return _.values(this.links)[0];
			} else if (numberOfLinks >= this.options.maximumLinks) {
				return null;
			}
		}
		return null;
	}

	updateCoords({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	canLinkToPort(port: PortModel): boolean {
		return true;
	}

	isLocked() {
		return super.isLocked() || this.getParent().isLocked();
	}
}
