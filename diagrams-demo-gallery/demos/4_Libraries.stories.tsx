import { Toolkit } from '@projectstorm/react-canvas-core';
Toolkit.TESTING = true;

export default {
	title: 'External Libs'
};

import demo_3rd_dagre from './demo-dagre';
import demo_gsap from './demo-animation';

export const DagreDistribute = demo_3rd_dagre;
export const GsapAnimation = demo_gsap;
