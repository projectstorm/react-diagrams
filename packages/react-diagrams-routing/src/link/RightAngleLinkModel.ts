import { DefaultLinkModel, DefaultLinkModelOptions } from '@projectstorm/react-diagrams-defaults';
import { RightAngleLinkFactory } from './RightAngleLinkFactory';

export class RightAngleLinkModel extends DefaultLinkModel {
	lastHoverIndexOfPath: number;
	firstPathXdirection: boolean;
	lastPathXdirection: boolean;
	constructor(options: DefaultLinkModelOptions = { }) {
		super({
			type: RightAngleLinkFactory.NAME,
			...options
		});
		this.lastHoverIndexOfPath = 0;
		this.lastPathXdirection = false;
		this.firstPathXdirection = false;
	}

	performanceTune() {
		return false;
	}
}
