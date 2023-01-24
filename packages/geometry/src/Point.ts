import { Matrix } from './Matrix';

export class Point {
	x: number;
	y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	translate(x: number, y: number) {
		this.x += x;
		this.y += y;
	}

	clone() {
		return new Point(this.x, this.y);
	}

	toSVG() {
		return this.x + ' ' + this.y;
	}

	asMatrix() {
		return new Matrix([[this.x], [this.y], [1]]);
	}

	transform(matrix: Matrix) {
		let final: Matrix = matrix.mmul(this.asMatrix());
		this.x = final.get(0, 0);
		this.y = final.get(1, 0);
	}

	public static middlePoint(pointA: Point, pointB: Point): Point {
		return new Point((pointB.x + pointA.x) / 2, (pointB.y + pointA.y) / 2);
	}
}
