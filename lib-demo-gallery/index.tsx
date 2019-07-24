import * as React from "react";
import {storiesOf, addParameters} from "@storybook/react";
import {setOptions} from "@storybook/addon-options";
import {Toolkit} from "@projectstorm/react-diagrams-core";
import {themes} from '@storybook/theming';
import "./src/helpers/demo.scss";

Toolkit.TESTING = true;

addParameters({
	options: {
		theme: themes.dark,
	},
});

setOptions({
	name: "STORM React Diagrams",
	url: "https://github.com/projectstorm/react-diagrams",
	addonPanelInRight: true
});

import demo_simple from "./src/demo-simple";
import demo_flow from "./src/demo-simple-flow";
import demo_performance from "./src/demo-performance";
import demo_locks from "./src/demo-locks";
import demo_grid from "./src/demo-grid";
import demo_limit_points from "./src/demo-limit-points";
import demo_listeners from "./src/demo-listeners";
import demo_zoom from "./src/demo-zoom-to-fit";
import demo_labels from "./src/demo-labelled-links";

storiesOf("Simple Usage", module)
	.add("Simple example", demo_simple)
	.add("Simple flow example", demo_flow)
	.add("Performance demo", demo_performance)
	.add("Locked widget", demo_locks)
	.add("Canvas grid size", demo_grid)
	.add("Limiting link points", demo_limit_points)
	.add("Events and listeners", demo_listeners)
	.add("Zoom to fit", demo_zoom)
	.add("Links with labels", demo_labels);

import demo_adv_clone_selected from "./src/demo-cloning";
import demo_adv_ser_des from "./src/demo-serializing";
import demo_adv_prog from "./src/demo-mutate-graph";
import demo_adv_dnd from "./src/demo-drag-and-drop";
import demo_smart_routing from "./src/demo-smart-routing";

storiesOf("Advanced Techniques", module)
	.add("Clone Selected", demo_adv_clone_selected)
	.add("Serializing and de-serializing", demo_adv_ser_des)
	.add("Programatically modifying graph", demo_adv_prog)
	.add("Drag and drop", demo_adv_dnd)
	.add("Smart routing", demo_smart_routing);

import demo_cust_nodes from "./src/demo-custom-node1";
import demo_cust_links from "./src/demo-custom-link1";

storiesOf("Custom Models", module)
	.add("Custom diamond node", demo_cust_nodes)
	.add("Custom animated links", demo_cust_links);

import demo_3rd_dagre from "./src/demo-dagre";

storiesOf("3rd party libraries", module)
	.add("Auto Distribute (Dagre)", demo_3rd_dagre);

// enable this to log mouse location when writing new puppeteer tests
//Helper.logMousePosition()
