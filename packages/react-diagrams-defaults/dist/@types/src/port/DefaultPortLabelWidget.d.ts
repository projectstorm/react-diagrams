import * as React from 'react';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { DefaultPortModel } from './DefaultPortModel';
export interface DefaultPortLabelProps {
    port: DefaultPortModel;
    engine: DiagramEngine;
}
export declare class DefaultPortLabel extends React.Component<DefaultPortLabelProps> {
    render(): JSX.Element;
}
