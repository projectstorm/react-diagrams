import * as React from 'react';
import { storiesOf, addParameters, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { themes } from '@storybook/theming';
import './demos/helpers/index.css';
import { Toolkit } from '@projectstorm/react-canvas-core';

Toolkit.TESTING = true;

addParameters({
	options: {
		theme: themes.dark
	}
});

setOptions({
	name: 'STORM React Diagrams',
	url: 'https://github.com/projectstorm/react-diagrams',
	addonPanelInRight: true
});

addDecorator(fn => {
	Toolkit.TESTING_UID = 0;
	return fn();
});

import demo_simple from './demos/demo-simple';
import demo_flow from './demos/demo-simple-flow';
import demo_performance from './demos/demo-performance';
import demo_locks from './demos/demo-locks';
import demo_grid from './demos/demo-grid';
import demo_listeners from './demos/demo-listeners';
import demo_zoom from './demos/demo-zoom-to-fit';
import demo_labels from './demos/demo-labelled-links';
import demo_dynamic_ports from './demos/demo-dynamic-ports';
import demo_alternative_linking from './demos/demo-alternative-linking';
import demo_custom_delete_keys from './demos/demo-custom_delete_keys';

storiesOf('Simple Usage', module)
	.add('Simple example', demo_simple)
	.add('Simple flow example', demo_flow)
	.add('Performance demo', demo_performance)
	.add('Locked widget', demo_locks)
	.add('Canvas grid size', demo_grid)
	.add('Events and listeners', demo_listeners)
	.add('Zoom to fit', demo_zoom)
	.add('Dynamic ports', demo_dynamic_ports)
	.add('Links with labels', demo_labels);

import demo_adv_clone_selected from './demos/demo-cloning';
import demo_adv_ser_des from './demos/demo-serializing';
import demo_adv_prog from './demos/demo-mutate-graph';
import demo_adv_dnd from './demos/demo-drag-and-drop';
import demo_smart_routing from './demos/demo-smart-routing';
import demo_right_angles_routing from './demos/demo-right-angles-routing';

storiesOf('Advanced Techniques', module)
	.add('Clone Selected', demo_adv_clone_selected)
	.add('Serializing and de-serializing', demo_adv_ser_des)
	.add('Programatically modifying graph', demo_adv_prog)
	.add('Drag and drop', demo_adv_dnd)
	.add('Smart routing', demo_smart_routing)
	.add('Right angles routing', demo_right_angles_routing)
	.add('Linking by clicking instead of dragging', demo_alternative_linking)
	.add('Setting custom delete keys', demo_custom_delete_keys);

import demo_cust_nodes from './demos/demo-custom-node1';
import demo_cust_links from './demos/demo-custom-link1';

storiesOf('Custom Models', module)
	.add('Custom diamond node', demo_cust_nodes)
	.add('Custom animated links', demo_cust_links);

import demo_3rd_dagre from './demos/demo-dagre';

storiesOf('3rd party libraries', module).add('Auto Distribute (Dagre)', demo_3rd_dagre);
