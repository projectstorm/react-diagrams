import { PathFindingLinkFactory } from './PathFindingLinkFactory';
import { LinkModel } from '@projectstorm/react-diagrams-core';

export class PathFindingLinkModel extends LinkModel {
	constructor() {
		super({
			type: PathFindingLinkFactory.NAME
		});
	}
}
