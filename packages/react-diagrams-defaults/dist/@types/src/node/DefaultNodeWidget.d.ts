import * as React from 'react';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { DefaultNodeModel } from './DefaultNodeModel';
export interface DefaultNodeProps {
    node: DefaultNodeModel;
    engine: DiagramEngine;
}
/**
 * Default node that models the DefaultNodeModel. It creates two columns
 * for both all the input ports on the left, and the output ports on the right.
 */
export declare class DefaultNodeWidget extends React.Component<DefaultNodeProps> {
    generatePort: (port: any) => JSX.Element;
    render(): JSX.Element;
}
