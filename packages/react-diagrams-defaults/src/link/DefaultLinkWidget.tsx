import { DiagramEngine, LinkWidget, PointModel } from '@projectstorm/react-diagrams-core';
import * as React from 'react';
import { MouseEvent, useEffect, useRef } from 'react';
import { DefaultLinkModel } from './DefaultLinkModel';
import { DefaultLinkPointWidget } from './DefaultLinkPointWidget';
import { DefaultLinkSegmentWidget } from './DefaultLinkSegmentWidget';

export interface DefaultLinkProps {
	link: DefaultLinkModel;
	diagramEngine: DiagramEngine;
	pointAdded?: (point: PointModel, event: MouseEvent) => any;
	renderPoints?: boolean;
	selected?: (event: MouseEvent) => any;
}

export const DefaultLinkWidget: React.FC<DefaultLinkProps> = (props) => {
	const [selected, setSelected] = React.useState(false);
	const refPaths = useRef<React.RefObject<SVGPathElement>[]>([]);

	const renderPoints = () => {
		return props.renderPoints ?? true;
	};

	useEffect(() => {
		props.link.setRenderedPaths(refPaths.current.map((ref) => ref.current).filter(Boolean) as SVGPathElement[]);
		return () => {
			props.link.setRenderedPaths([]);
		};
	}, [props.link]);

	const generateRef = () => {
		const ref = React.createRef<SVGPathElement>();
		refPaths.current.push(ref);
		return ref;
	};

	const addPointToLink = (event: MouseEvent, index: number) => {
		if (
			!event.shiftKey &&
			!props.link.isLocked() &&
			props.link.getPoints().length - 1 <= props.diagramEngine.getMaxNumberPointsPerLink()
		) {
			const position = props.diagramEngine.getRelativeMousePoint(event);
			const point = props.link.point(position.x, position.y, index);
			event.persist();
			event.stopPropagation();
			props.diagramEngine.getActionEventBus().fireAction({
				event,
				model: point
			});
		}
	};

	const generatePoint = (point: PointModel): JSX.Element => {
		return (
			<DefaultLinkPointWidget
				key={point.getID()}
				point={point as any}
				colorSelected={props.link.getOptions().selectedColor ?? ''}
				color={props.link.getOptions().color}
			/>
		);
	};

	const generateLink = (path: string, extraProps: any, id: string | number): JSX.Element => {
		return (
			<DefaultLinkSegmentWidget
				key={`link-${id}`}
				path={path}
				selected={selected}
				diagramEngine={props.diagramEngine}
				factory={props.diagramEngine.getFactoryForLink(props.link)}
				link={props.link}
				forwardRef={generateRef()}
				onSelection={setSelected}
				extras={extraProps}
			/>
		);
	};

	const points = props.link.getPoints();
	const paths = [];
	refPaths.current = []; // Reset the refPaths for the current render

	if (points.length === 2) {
		paths.push(
			generateLink(
				props.link.getSVGPath(),
				{
					onMouseDown: (event: MouseEvent) => {
						props.selected?.(event);
						addPointToLink(event, 1);
					}
				},
				'0'
			)
		);

		if (props.link.getTargetPort() == null) {
			paths.push(generatePoint(points[1]));
		}
	} else {
		for (let j = 0; j < points.length - 1; j++) {
			paths.push(
				generateLink(
					LinkWidget.generateLinePath(points[j], points[j + 1]),
					{
						'data-linkid': props.link.getID(),
						'data-point': j,
						onMouseDown: (event: MouseEvent) => {
							props.selected?.(event);
							addPointToLink(event, j + 1);
						}
					},
					j
				)
			);
		}

		if (renderPoints()) {
			for (let i = 1; i < points.length - 1; i++) {
				paths.push(generatePoint(points[i]));
			}

			if (props.link.getTargetPort() == null) {
				paths.push(generatePoint(points[points.length - 1]));
			}
		}
	}

	return <g data-default-link-test={props.link.getOptions().testName}>{paths}</g>;
};
