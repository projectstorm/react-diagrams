import * as mathjs from 'mathjs';
import { Matrix } from 'mathjs';
export declare class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
    translate(x: number, y: number): void;
    clone(): Point;
    toSVG(): string;
    asMatrix(): mathjs.Matrix;
    transform(matrix: Matrix): void;
    static middlePoint(pointA: Point, pointB: Point): Point;
    static multiply(...matrices: Matrix[]): Matrix;
    static scaleMatrix(x: number, y: number): Matrix;
    static translateMatrix(x: number, y: number): Matrix;
    static rotateMatrix(deg: number): Matrix;
    static createScaleMatrix(x: any, y: any, origin: Point): Matrix;
    static createRotateMatrix(deg: number, origin: Point): Matrix;
}
