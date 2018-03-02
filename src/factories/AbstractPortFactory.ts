import { PortModel } from "../models/PortModel";
import { DiagramEngine } from "../DiagramEngine";
import { AbstractFactory } from "./AbstractFactory";

export abstract class AbstractPortFactory<T extends PortModel = PortModel> extends AbstractFactory<T> {}
