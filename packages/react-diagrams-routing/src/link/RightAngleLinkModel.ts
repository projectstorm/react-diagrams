import { DefaultLinkModel, DefaultLinkModelOptions } from '@projectstorm/react-diagrams-defaults';
import { RightAngleLinkFactory } from './RightAngleLinkFactory';

export class RightAngleLinkModel extends DefaultLinkModel {
	lastHoverIndexOfPath: number;
	constructor(options: DefaultLinkModelOptions = { }) {
		super({
			type: RightAngleLinkFactory.NAME,
			...options
		});
		this.lastHoverIndexOfPath = 0;
	}

	performanceTune() {
		return false;
	}
}
