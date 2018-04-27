import * as React from "react";
import { DefaultLinkWidget } from "../widgets/DefaultLinkWidget";
import { DiagramEngine } from "../../DiagramEngine";
import { AbstractElementFactory } from "@projectstorm/react-canvas";
import { DefaultLinkModel } from "../models/DefaultLinkModel";

export class DefaultLinkFactory extends AbstractElementFactory<DefaultLinkModel> {
	constructor() {
		super("default");
	}

	generateWidget(engine: DiagramEngine, model: DefaultLinkModel): JSX.Element {
		return React.createElement(DefaultLinkWidget, {
			link: model,
			diagramEngine: engine
		});
	}

	generateModel(): DefaultLinkModel {
		return new DefaultLinkModel();
	}

	generateLinkSegment(model: DefaultLinkModel, widget: DefaultLinkWidget, selected: boolean, path: string) {
		return (
			<path
				className={selected ? widget.bem("--path-selected") : ""}
				strokeWidth={model.getWidth()}
				stroke={model.getColor()}
				d={path}
			/>
		);
	}
}
