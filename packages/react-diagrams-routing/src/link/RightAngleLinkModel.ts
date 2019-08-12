import { DefaultLinkModel, DefaultLinkModelOptions } from '@projectstorm/react-diagrams-defaults';
import {RightAngleLinkFactory} from "./RightAngleLinkFactory";

export class RightAngleLinkModel extends DefaultLinkModel {
	constructor(options: DefaultLinkModelOptions = {}) {
		super({
			type: RightAngleLinkFactory.NAME,
			...options
		});
	}

	performanceTune() {
		return false;
	}
}
