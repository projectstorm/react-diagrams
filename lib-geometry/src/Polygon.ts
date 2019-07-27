import { Point } from './Point';
import * as _ from 'lodash';
import { Matrix } from 'mathjs';

export class Polygon {
	protected points: Point[];

	constructor(points: Point[] = []) {
		this.points = points;
	}

	serialize() {
		return _.map(this.points, point => {
			return [point.x, point.y];
		});
	}

	deserialize(data: any) {
		this.points = _.map(data, point => {
			return new Point(point[0], point[1]);
		});
	}

	scale(x, y, origin: Point) {
		let matrix = Point.createScaleMatrix(x, y, origin);
		_.forEach(this.points, point => {
			point.transform(matrix);
		});
	}

	transform(matrix: Matrix) {
		_.forEach(this.points, point => {
			point.transform(matrix);
		});
	}

	setPoints(points: Point[]) {
		this.points = points;
	}

	getPoints(): Point[] {
		return this.points;
	}

	rotate(degrees: number) {
		this.transform(Point.createRotateMatrix(degrees / (180 / Math.PI), this.getOrigin()));
	}

	translate(offsetX: number, offsetY: number) {
		_.forEach(this.points, point => {
			point.translate(offsetX, offsetY);
		});
	}

	doClone(ob: this) {
		this.points = _.map(ob.points, point => {
			return point.clone();
		});
	}

	clone(): this {
		let ob = Object.create(this);
		ob.doClone(this);
		return ob;
	}

	getOrigin(): Point {
		if (this.points.length === 0) {
			return null;
		}
		let dimensions = this.getBoundingBox();
		return Point.middlePoint(dimensions.getTopLeft(), dimensions.getBottomRight());
	}

	static boundingBoxFromPolygons(polygons: Polygon[]): Rectangle {
		return Polygon.boundingBoxFromPoints(
			_.flatMap(polygons, polygon => {
				return polygon.getPoints();
			})
		);
	}

	static boundingBoxFromPoints(points: Point[]): Rectangle {
		if (points.length === 0) {
			return new Rectangle(0, 0, 0, 0);
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

		return new Rectangle(new Point(minX, minY), new Point(maxX, minY), new Point(maxX, maxY), new Point(minX, maxY));
	}

	getBoundingBox(): Rectangle {
		let minX = this.points[0].x;
		let maxX = this.points[0].x;
		let minY = this.points[0].y;
		let maxY = this.points[0].y;

		for (let i = 1; i < this.points.length; i++) {
			if (this.points[i].x < minX) {
				minX = this.points[i].x;
			}
			if (this.points[i].x > maxX) {
				maxX = this.points[i].x;
			}
			if (this.points[i].y < minY) {
				minY = this.points[i].y;
			}
			if (this.points[i].y > maxY) {
				maxY = this.points[i].y;
			}
		}

		return new Rectangle(new Point(minX, minY), new Point(maxX, minY), new Point(maxX, maxY), new Point(minX, maxY));
	}
}

import { Rectangle } from './Rectangle';
