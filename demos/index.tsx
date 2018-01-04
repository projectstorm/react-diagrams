import * as React from "react";
import {storiesOf} from "@storybook/react";
import * as storybook from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {setOptions} from '@storybook/addon-options';
import {Toolkit} from "../src/Toolkit";
import { host } from 'storybook-host';
import { withReadme, withDocs }  from 'storybook-readme';

import demo_simple from "./demo-simple/index";
import demo_performance from "./demo-performance/index";
import demo_custom_node1 from "./demo-custom-node1/index";
import demo_locks from "./demo-locks/index";
import demo_drag_and_drop from "./demo-drag-and-drop/index";
import demo_serializing from "./demo-serializing/index";
import demo_grid from "./demo-grid/index";
import demo_limit_points from "./demo-limit-points/index";
import demo_listeners from "./demo-listeners/index";
import demo_mutate_graph from "./demo-mutate-graph/index";
import demo_zoom_to_fit from "./demo-zoom-to-fit/index";
import demo_custom_link1 from "./demo-custom-link1/index";
import demo_cloning from "./demo-cloning/index";
import demo_dagre from "./demo-dagre/index";

import {Helper} from "./Helper";

require("./demo.scss");

// make tests deterministic
Toolkit.TESTING_MODE = true;

// Option defaults:
setOptions({
	name: 'STORM React Diagrams',
	url: 'https://github.com/projectstorm/react-diagrams',
	addonPanelInRight: true
});

const withCustomPreview = withDocs({
	PreviewComponent: ({ children }) => {
		return <div className="docs-preview-wrapper">{children}</div>
	}
})

storiesOf("Simple Usage", module)
	.add("Simple example", withCustomPreview(
		require("./demo-simple/docs.md"),
		() => demo_simple()
	))
	// .addDecorator(host({
	// 	height: '100%',
	// 	width: '100%'
	// }))
	.add("Performance demo", () => {
		return demo_performance();
	})
	.add("Locked widget", () => {
		return demo_locks();
	})
	.add("Grid size", () => {
		return demo_grid();
	})
	.add("Limiting number of points", () => {
		return demo_limit_points();
	})
	.add("Events and listeners", () => {
		return demo_listeners();
	})
	.add("Zoom to fit", () => {
		return demo_zoom_to_fit();
	})

storiesOf("Advanced Techniques", module)
	.add("Clone selected", () => {
		return demo_cloning();
	})
	.add("Serializing and deserializing", () => {
		return demo_serializing();
	})
	.add("Programatically modify graph", () => {
		return demo_mutate_graph();
	})
	.add("Large application example", () => {
		return demo_drag_and_drop();
	})

storiesOf("Custom Models", module)
	.add("Custom diamond node", () => {
		return demo_custom_node1();
	})
	.add("Custom links", () => {
		return demo_custom_link1();
	})

storiesOf("3rd party libraries", module)
	.add("Auto distribute - Dagre", () => {
		return demo_dagre();
	})


// enable this to log mouse location when writing new puppeteer tests
//Helper.logMousePosition()
