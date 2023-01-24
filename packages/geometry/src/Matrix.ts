import { Point } from './Point';

export class Matrix {
	matrix: number[][];

	constructor(matrix: number[][]) {
		this.matrix = matrix;
	}

	mmul(matrix: Matrix): Matrix {
		this.matrix = this.matrix.map((row, i) =>
			matrix.asArray()[0].map((_, j) => row.reduce((acc, _, n) => acc + this.matrix[i][n] * matrix.asArray()[n][j], 0))
		);
		return this;
	}

	asArray(): number[][] {
		return this.matrix;
	}

	get(rowIndex: number, columnIndex: number): number {
		return this.asArray()[rowIndex][columnIndex];
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
			Matrix.translateMatrix(origin.x, origin.y),
			Matrix.scaleMatrix(x, y),
			Matrix.translateMatrix(-origin.x, -origin.y)
		);
	}

	static createRotateMatrix(deg: number, origin: Point): Matrix {
		return this.multiply(
			Matrix.translateMatrix(origin.x, origin.y),
			Matrix.rotateMatrix(deg),
			Matrix.translateMatrix(-origin.x, -origin.y)
		);
	}
}
