import { Point } from './Point';

export enum BoundsCorner {
	TOP_LEFT = 'TL',
	TOP_RIGHT = 'TR',
	BOTTOM_RIGHT = 'BR',
	BOTTOM_LEFT = 'BL'
}

export type Bounds = { [k in BoundsCorner]: Point };

export const boundsFromPositionAndSize = (x: number, y: number, width: number, height: number): Bounds => {
	return {
		[BoundsCorner.TOP_LEFT]: new Point(x, y),
		[BoundsCorner.TOP_RIGHT]: new Point(x + width, y),
		[BoundsCorner.BOTTOM_RIGHT]: new Point(x + width, y + height),
		[BoundsCorner.BOTTOM_LEFT]: new Point(x, y + height)
	};
};

export const createEmptyBounds = () => {
	return {
		[BoundsCorner.TOP_LEFT]: new Point(),
		[BoundsCorner.TOP_RIGHT]: new Point(),
		[BoundsCorner.BOTTOM_RIGHT]: new Point(),
		[BoundsCorner.BOTTOM_LEFT]: new Point()
	};
};
