import { Point } from './Point';
import { Polygon } from './Polygon';
import { Bounds, BoundsCorner, boundsFromPositionAndSize, createEmptyBounds } from './Bounds';

export class Rectangle extends Polygon {
	static fromPositionAndSize(x: number, y: number, width: number, height: number) {
		return new Rectangle(boundsFromPositionAndSize(x, y, width, height));
	}

	static fromPointAndSize(position: Point, width: number, height: number) {
		return new Rectangle(boundsFromPositionAndSize(position.x, position.y, width, height));
	}

	constructor(points?: Bounds) {
		if (!points) {
			points = createEmptyBounds();
		}

		super([
			points[BoundsCorner.TOP_LEFT],
			points[BoundsCorner.TOP_RIGHT],
			points[BoundsCorner.BOTTOM_RIGHT],
			points[BoundsCorner.BOTTOM_LEFT]
		]);
	}

	updateDimensions(x: number, y: number, width: number, height: number) {
		const points = boundsFromPositionAndSize(x, y, width, height);
		this.setPoints([
			points[BoundsCorner.TOP_LEFT],
			points[BoundsCorner.TOP_RIGHT],
			points[BoundsCorner.BOTTOM_RIGHT],
			points[BoundsCorner.BOTTOM_LEFT]
		]);
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
