import { NodeModel } from '../node/NodeModel';
import { LinkModel } from '../link/LinkModel';
import * as _ from 'lodash';
import { DiagramEngine } from '../../DiagramEngine';
import { Point } from '@projectstorm/geometry';
import {
	BaseEntityEvent,
	BaseModelOptions,
	BasePositionModel,
	BasePositionModelGenerics,
	BasePositionModelListener
} from '@projectstorm/react-canvas-core';

export enum PortModelAlignment {
	TOP = 'top',
	LEFT = 'left',
	BOTTOM = 'bottom',
	RIGHT = 'right'
}

export interface PortModelListener extends BasePositionModelListener {
	/**
	 * fires when it first receives positional information
	 */
	reportInitialPosition?: (event: BaseEntityEvent<PortModel>) => void;
}

export interface PortModelOptions extends BaseModelOptions {
	alignment?: PortModelAlignment;
	maximumLinks?: number;
	name: string;
}

export interface PortModelGenerics extends BasePositionModelGenerics {
	OPTIONS: PortModelOptions;
	PARENT: NodeModel;
	LISTENER: PortModelListener;
}

export class PortModel<G extends PortModelGenerics = PortModelGenerics> extends BasePositionModel<G> {
	links: { [id: string]: LinkModel };

	// calculated post rendering so routing can be done correctly
	width: number;
	height: number;
	reportedPosition: boolean;

	constructor(options: G['OPTIONS']) {
		super(options);
		this.links = {};
		this.reportedPosition = false;
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.reportedPosition = false;
		this.options.name = ob.name;
		this.options.alignment = ob.alignment;
	}

	serialize() {
		return {
			...super.serialize(),
			name: this.options.name,
			alignment: this.options.alignment,
			parentNode: this.parent.getID(),
			links: _.map(this.links, link => {
				return link.getID();
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

	updateCoords(cords: { x: number; y: number; width: number; height: number }) {
		const { x, y, width, height } = cords;
		this.width = width;
		this.height = height;
		this.setPosition(x, y);
		const center = new Point(x + width / 2, y + height / 2);
		_.forEach(this.getLinks(), link => {
			link.getPointForPort(this).setPosition(center.clone());
		});
		this.reportedPosition = true;
		this.fireEvent(
			{
				entity: this
			},
			'reportInitialPosition'
		);
	}

	canLinkToPort(port: PortModel): boolean {
		return true;
	}

	isLocked() {
		return super.isLocked() || this.getParent().isLocked();
	}
}
