import { Point } from './Point';
import { Polygon } from './Polygon';
export declare enum BezierCurvepPoints {
    SOURCE = 0,
    SOURCE_CONTROL = 1,
    TARGET_CONTROL = 2,
    TARGET = 3
}
export declare class BezierCurve extends Polygon {
    constructor();
    getSVGCurve(): string;
    setPoints(points: Point[]): void;
    getSource(): Point;
    getSourceControl(): Point;
    getTargetControl(): Point;
    getTarget(): Point;
    setSource(point: Point): void;
    setSourceControl(point: Point): void;
    setTargetControl(point: Point): void;
    setTarget(point: Point): void;
}
