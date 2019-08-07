import * as React from "react";
import { LabViewLinkWidget } from "../widgets/LabViewLinkWidget";
import { DiagramEngine } from "../../DiagramEngine";
import { AbstractLinkFactory } from "../../factories/AbstractLinkFactory";
import { DefaultLinkModel } from "../../defaults/models/DefaultLinkModel";

/**
 * @author Dylan Vorster
 */
export class LabViewLinkFactory extends AbstractLinkFactory<DefaultLinkModel> {
	constructor() {
		super("labview");
	}

	generateReactWidget(diagramEngine: DiagramEngine, link: DefaultLinkModel): JSX.Element {
		return React.createElement(LabViewLinkWidget, {
			link: link,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance(initialConfig?: any): DefaultLinkModel {
		return new DefaultLinkModel();
	}

	generateLinkSegment(model: DefaultLinkModel, widget: LabViewLinkWidget, selected: boolean, path: string) {
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
