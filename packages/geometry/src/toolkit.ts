import { Point } from './Point';
import * as _ from 'lodash';
import { Polygon } from './Polygon';
import { Bounds, BoundsCorner, createEmptyBounds } from './Bounds';

export const boundingBoxFromPoints = (points: Point[]): Bounds => {
	if (points.length === 0) {
		return createEmptyBounds();
	}

	let minX = points[0].x;
	let maxX = points[0].x;
	let minY = points[0].y;
	let maxY = points[0].y;

	for (let i = 1; i < points.length; i++) {
		if (points[i].x < minX) {
			minX = points[i].x;
		}
		if (points[i].x > maxX) {
			maxX = points[i].x;
		}
		if (points[i].y < minY) {
			minY = points[i].y;
		}
		if (points[i].y > maxY) {
			maxY = points[i].y;
		}
	}

	return {
		[BoundsCorner.TOP_LEFT]: new Point(minX, minY),
		[BoundsCorner.TOP_RIGHT]: new Point(maxX, minY),
		[BoundsCorner.BOTTOM_RIGHT]: new Point(maxX, maxY),
		[BoundsCorner.BOTTOM_LEFT]: new Point(minX, maxY)
	};
};

export const boundingBoxFromPolygons = (polygons: Polygon[]): Bounds => {
	return boundingBoxFromPoints(
		_.flatMap(polygons, (polygon) => {
			return polygon.getPoints();
		})
	);
};
