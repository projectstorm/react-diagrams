import { Point } from './Point';
import { Polygon } from './Polygon';

export enum BezierCurvepPoints {
	SOURCE = 0,
	SOURCE_CONTROL = 1,
	TARGET_CONTROL = 2,
	TARGET = 3
}

export class BezierCurve extends Polygon {
	constructor() {
		super([new Point(0, 0), new Point(0, 0), new Point(0, 0), new Point(0, 0)]);
	}

	getSVGCurve(): string {
		return `M${this.getSource().toSVG()} C${this.getSourceControl().toSVG()}, ${this.getTargetControl().toSVG()}, ${this.getTarget().toSVG()}`;
	}

	setPoints(points: Point[]) {
		if (points.length !== 4) {
			throw new Error('BezierCurve must have extactly 4 points');
		}
		super.setPoints(points);
	}

	getSource(): Point {
		return this.points[BezierCurvepPoints.SOURCE];
	}

	getSourceControl(): Point {
		return this.points[BezierCurvepPoints.SOURCE_CONTROL];
	}

	getTargetControl(): Point {
		return this.points[BezierCurvepPoints.TARGET_CONTROL];
	}

	getTarget(): Point {
		return this.points[BezierCurvepPoints.TARGET];
	}

	setSource(point: Point) {
		this.points[BezierCurvepPoints.SOURCE] = point;
	}

	setSourceControl(point: Point) {
		this.points[BezierCurvepPoints.SOURCE_CONTROL] = point;
	}

	setTargetControl(point: Point) {
		this.points[BezierCurvepPoints.TARGET_CONTROL] = point;
	}

	setTarget(point: Point) {
		this.points[BezierCurvepPoints.TARGET] = point;
	}
}
