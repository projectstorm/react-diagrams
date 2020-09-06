import { Matrix } from './Matrix';

export class Point {
	x: number;
	y: number;

	constructor(x: number, y: number) {
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

	public static multiply(...matrices: Matrix[]): Matrix {
		let m: Matrix = matrices[0];
		for (let i = 1; i < matrices.length; i++) {
			m = m.mmul(matrices[i]);
		}
		return m;
	}

	public static scaleMatrix(x: number, y: number): Matrix {
		return new Matrix([
			[x, 0, 0],
			[0, y, 0],
			[0, 0, 1]
		]);
	}

	public static translateMatrix(x: number, y: number): Matrix {
		return new Matrix([
			[1, 0, x],
			[0, 1, y],
			[0, 0, 1]
		]);
	}

	public static rotateMatrix(deg: number): Matrix {
		return new Matrix([
			[Math.cos(deg), -1 * Math.sin(deg), 0],
			[Math.sin(deg), Math.cos(deg), 0],
			[0, 0, 1]
		]);
	}

	static createScaleMatrix(x, y, origin: Point): Matrix {
		return this.multiply(
			Point.translateMatrix(origin.x, origin.y),
			Point.scaleMatrix(x, y),
			Point.translateMatrix(-origin.x, -origin.y)
		);
	}

	static createRotateMatrix(deg: number, origin: Point): Matrix {
		return this.multiply(
			Point.translateMatrix(origin.x, origin.y),
			Point.rotateMatrix(deg),
			Point.translateMatrix(-origin.x, -origin.y)
		);
	}
}
