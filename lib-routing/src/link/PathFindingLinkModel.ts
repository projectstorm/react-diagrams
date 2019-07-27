import { PathFindingLinkFactory } from './PathFindingLinkFactory';
import { BaseModelOptions, LinkModel } from '@projectstorm/react-diagrams-core';

export interface PathFindingLinkModelOptions extends Omit<BaseModelOptions, 'type'> {}

export class PathFindingLinkModel extends LinkModel {
	constructor(options: PathFindingLinkModelOptions = {}) {
		super({
			type: PathFindingLinkFactory.NAME,
			...options
		});
	}
}
