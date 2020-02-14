import { Point } from './Point';
import { Polygon } from './Polygon';
export declare class Rectangle extends Polygon {
    constructor(tl: Point, tr: Point, br: Point, bl: Point);
    constructor(position: Point, width: number, height: number);
    constructor(x?: number, y?: number, width?: number, height?: number);
    static pointsFromBounds(x: number, y: number, width: number, height: number): Point[];
    updateDimensions(x: number, y: number, width: number, height: number): void;
    setPoints(points: Point[]): void;
    containsPoint(point: Point): boolean;
    getWidth(): number;
    getHeight(): number;
    getTopMiddle(): Point;
    getBottomMiddle(): Point;
    getLeftMiddle(): Point;
    getRightMiddle(): Point;
    getTopLeft(): Point;
    getTopRight(): Point;
    getBottomRight(): Point;
    getBottomLeft(): Point;
}
