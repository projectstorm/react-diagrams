/// <reference types="react" />
import { DefaultLinkFactory } from '@projectstorm/react-diagrams-defaults';
import { RightAngleLinkModel } from './RightAngleLinkModel';
/**
 * @author Daniel Lazar
 */
export declare class RightAngleLinkFactory extends DefaultLinkFactory<RightAngleLinkModel> {
    static NAME: string;
    constructor();
    generateModel(event: any): RightAngleLinkModel;
    generateReactWidget(event: any): JSX.Element;
}
