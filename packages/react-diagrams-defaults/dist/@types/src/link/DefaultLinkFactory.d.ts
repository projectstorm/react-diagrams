/// <reference types="react" />
import { DefaultLinkModel } from './DefaultLinkModel';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
export declare class DefaultLinkFactory<Link extends DefaultLinkModel = DefaultLinkModel> extends AbstractReactFactory<Link, DiagramEngine> {
    constructor(type?: string);
    generateReactWidget(event: any): JSX.Element;
    generateModel(event: any): Link;
    generateLinkSegment(model: Link, selected: boolean, path: string): JSX.Element;
}
