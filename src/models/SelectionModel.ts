import {BaseModel, BaseListener} from "@projectstorm/react-canvas";

import { BaseEntity } from "../BaseEntity";

export interface SelectionModel {
	model: BaseModel<BaseEntity, BaseListener>;
	initialX: number;
	initialY: number;
}
