import { Toolkit } from '@projectstorm/react-canvas-core';
Toolkit.TESTING = true;

export default {
	title: 'Customization'
};

import demo_custom_link_label from './demo-custom-link-label';
import demo_custom_action from './demo-custom-action';
import demo_cust_nodes from './demo-custom-node1';
import demo_cust_links from './demo-custom-link1';
import demo_cust_links2 from './demo-custom-link2';

export const CustomDiamondNode = demo_cust_nodes;
export const CustomAnimatedLinks = demo_cust_links;
export const CustomLinkEndsWithArrows = demo_cust_links2;
export const CustomLinkLabel = demo_custom_link_label;
export const CustomEvent = demo_custom_action;
