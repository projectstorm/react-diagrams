import { CanvasEngine } from '../CanvasEngine';

export abstract class AbstractState {
	engine: CanvasEngine;

	activated() {}

	deactivated() {}
}
