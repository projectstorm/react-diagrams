import * as React from "react";
import { RightAngleLinkWidget } from "../widgets/RightAngleLinkWidget";
import { DiagramEngine } from "../../../DiagramEngine";
import { AbstractLinkFactory } from "../../../factories/AbstractLinkFactory";
import { DefaultLinkModel } from "../../../defaults/models/DefaultLinkModel";

/**
 * @author Dylan Vorster
 */
export class RightAngleLinkFactory extends AbstractLinkFactory<DefaultLinkModel> {
	constructor() {
		super("rightAngle");
	}

	generateReactWidget(diagramEngine: DiagramEngine, link: DefaultLinkModel): JSX.Element {
		return React.createElement(RightAngleLinkWidget, {
			link: link,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance(initialConfig?: any): DefaultLinkModel {
		return new DefaultLinkModel();
	}

	generateLinkSegment(model: DefaultLinkModel, widget: RightAngleLinkWidget, selected: boolean, path: string) {
		return (
			<path
				className={selected ? widget.bem("--path-selected") : ""}
				strokeWidth={model.width}
				stroke={model.color}
				d={path}
			/>
		);
	}
}
