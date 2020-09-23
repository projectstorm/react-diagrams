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
}
