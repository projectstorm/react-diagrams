import * as React from "react";
import {storiesOf} from "@storybook/react";

import demo_simple from "../demos/demo-simple/index";
import demo_performance from "../demos/demo-performance/index";
import demo_custom_node1 from "../demos/demo-custom-node1/index";
import demo_locks from "../demos/demo-locks/index";
import demo_drag_and_drop from "../demos/demo-drag-and-drop/index";
import demo_serializing from "../demos/demo-serializing/index";
import demo_grid from "../demos/demo-grid/index";
import demo_limit_points from "../demos/demo-limit-points/index";
import demo_listeners from "../demos/demo-listeners/index";
import demo_mutate_graph from "../demos/demo-mutate-graph/index";
import demo_zoom_to_fit from "../demos/demo-zoom-to-fit/index";
import demo_custom_link1 from "../demos/demo-custom-link1/index";
import demo_cloning from "../demos/demo-cloning/index";
import demo_dagre from "../demos/demo-dagre/index";
import {Toolkit} from "../src/Toolkit";

Toolkit.TESTING_MODE = true;

storiesOf("Tests", module)
	.add("Simple example", () => {
		return demo_simple();
	})
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
	.add("Custom diamond node", () => {
		return demo_custom_node1();
	})
	.add("Custom links", () => {
		return demo_custom_link1();
	})
	.add("Auto distribute - Dagre", () => {
		return demo_dagre();
	})
