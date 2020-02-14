import * as React from 'react';
import { BaseModel } from '../core-models/BaseModel';
export interface PeformanceWidgetProps {
    children: () => JSX.Element;
    serialized: object;
    model: BaseModel;
}
export interface PeformanceWidgetState {
}
export declare class PeformanceWidget extends React.Component<PeformanceWidgetProps, PeformanceWidgetState> {
    shouldComponentUpdate(nextProps: Readonly<PeformanceWidgetProps>, nextState: Readonly<PeformanceWidgetState>, nextContext: any): boolean;
    render(): JSX.Element;
}
