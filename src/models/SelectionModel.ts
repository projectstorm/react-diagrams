import { BaseModel, BaseModelListener } from "./BaseModel";
import { BaseEntity } from "../BaseEntity";

export interface SelectionModel {
	model: BaseModel<BaseEntity, BaseModelListener>;
	initialX: number;
	initialY: number;
}
