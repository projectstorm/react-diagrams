import { Rectangle } from '@projectstorm/geometry';

export interface ModelGeometryInterface {
	getBoundingBox(): Rectangle;
}
