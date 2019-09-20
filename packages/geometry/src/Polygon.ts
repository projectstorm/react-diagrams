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

// Avoid circular dependency hell

export class Rectangle extends Polygon {
	constructor(tl: Point, tr: Point, br: Point, bl: Point);
	constructor(position: Point, width: number, height: number);
	constructor(x?: number, y?: number, width?: number, height?: number);

	constructor(a: any = 0, b: any = 0, c: any = 0, d: any = 0) {
		if (a instanceof Point && b instanceof Point && c instanceof Point && d instanceof Point) {
			super([a, b, c, d]);
		} else if (a instanceof Point) {
			super([a, new Point(a.x + b, a.y), new Point(a.x + b, a.y + c), new Point(a.x, a.y + c)]);
		} else {
			super(Rectangle.pointsFromBounds(a, b, c, d));
		}
	}

	static pointsFromBounds(x: number, y: number, width: number, height: number): Point[] {
		return [new Point(x, y), new Point(x + width, y), new Point(x + width, y + height), new Point(x, y + height)];
	}

	updateDimensions(x: number, y: number, width: number, height: number) {
		this.points = Rectangle.pointsFromBounds(x, y, width, height);
	}

	setPoints(points: Point[]) {
		if (points.length !== 4) {
			throw 'Rectangles must always have 4 points';
		}
		super.setPoints(points);
	}

	containsPoint(point: Point) {
		const tl = this.getTopLeft();
		const br = this.getBottomRight();

		return point.x >= tl.x && point.x <= br.x && point.y >= tl.y && point.y <= br.y;
	}

	getWidth(): number {
		return Math.sqrt(
			Math.pow(this.getTopLeft().x - this.getTopRight().x, 2) + Math.pow(this.getTopLeft().y - this.getTopRight().y, 2)
		);
	}

	getHeight(): number {
		return Math.sqrt(
			Math.pow(this.getBottomLeft().x - this.getTopLeft().x, 2) +
			Math.pow(this.getBottomLeft().y - this.getTopLeft().y, 2)
		);
	}

	getTopMiddle(): Point {
		return Point.middlePoint(this.getTopLeft(), this.getTopRight());
	}

	getBottomMiddle(): Point {
		return Point.middlePoint(this.getBottomLeft(), this.getBottomRight());
	}

	getLeftMiddle(): Point {
		return Point.middlePoint(this.getBottomLeft(), this.getTopLeft());
	}

	getRightMiddle(): Point {
		return Point.middlePoint(this.getBottomRight(), this.getTopRight());
	}

	getTopLeft(): Point {
		return this.points[0];
	}

	getTopRight(): Point {
		return this.points[1];
	}

	getBottomRight(): Point {
		return this.points[2];
	}

	getBottomLeft(): Point {
		return this.points[3];
	}
}
