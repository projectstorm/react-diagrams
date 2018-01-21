import * as React from "react";
import {DefaultLinkWidget} from "../widgets/DefaultLinkWidget";
import {DiagramEngine} from "../../DiagramEngine";
import {LinkModel} from "../../models/LinkModel";
import {LinkFactory} from "../../AbstractFactory";
import {PointModel} from "../../models/PointModel";
import {DefaultLinkModel} from "../models/DefaultLinkModel";
import {Toolkit} from "../../Toolkit";

/**
 * @author Dylan Vorster
 */
export class DefaultLinkFactory extends LinkFactory<DefaultLinkModel> {
	constructor() {
		super("default");
	}

	generateReactWidget(diagramEngine: DiagramEngine, link: DefaultLinkModel): JSX.Element {
		return React.createElement(DefaultLinkWidget, {
			link: link,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance(initialConfig?: any): DefaultLinkModel {
		return new DefaultLinkModel();
	}


	generateLinkSegment(diagramEngine: DiagramEngine, model: DefaultLinkModel, selected: boolean, firstPoint: PointModel, lastPoint: PointModel, smooth: boolean) {
		return (
			<path
				className={selected ? "selected" : ''}
				strokeWidth={model.width}
				stroke={model.color}
				d={smooth ? Toolkit.generateCurvePath(firstPoint, lastPoint, model.curvyness) : Toolkit.generateLinePath(firstPoint, lastPoint)}
			/>
		);
	}

}
