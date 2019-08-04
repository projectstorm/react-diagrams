import { MouseEvent, KeyboardEvent, WheelEvent } from 'react';
import { Toolkit } from '../Toolkit';
import { CanvasEngine } from '../CanvasEngine';

export enum InputType {
	MOUSE_DOWN = 'mouse-down',
	MOUSE_UP = 'mouse-up',
	MOUSE_MOVE = 'mouse-move',
	MOUSE_WHEEL = 'mouse-wheel',
	KEY_DOWN = 'key-down',
	KEY_UP = 'key-up'
}

export interface Mapping {
	[InputType.MOUSE_DOWN]: MouseEvent;
	[InputType.MOUSE_UP]: MouseEvent;
	[InputType.MOUSE_MOVE]: MouseEvent;
	[InputType.MOUSE_WHEEL]: WheelEvent;
	[InputType.KEY_DOWN]: KeyboardEvent;
	[InputType.KEY_UP]: KeyboardEvent;
}

export interface ActionOptions {
	type: InputType;
	fire(event: Mapping[this['type']]);
}

export class Action<T extends CanvasEngine = CanvasEngine> {
	options: ActionOptions;
	id: string;
	engine: T;

	constructor(options: ActionOptions) {
		this.options = options;
		this.id = Toolkit.UID();
	}

	setEngine(engine: T) {
		this.engine = engine;
	}
}
