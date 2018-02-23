import * as React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { setOptions } from "@storybook/addon-options";
import { Toolkit } from "../src/Toolkit";
import { host } from "storybook-host";
import { Helper } from "./.helpers/Helper";

//include the SCSS for the demo
require("./.helpers/demo.scss");

// make tests deterministic
Toolkit.TESTING_MODE = true;

addDecorator(
	host({
		cropMarks: false,
		height: "100%",
		width: "100%",
		padding: 20
	})
);

setOptions({
	name: "STORM React Diagrams",
	url: "https://github.com/projectstorm/react-diagrams",
	addonPanelInRight: true
});

storiesOf("Simple Usage", module)
	.add(
		"Simple example",
		Helper.makeDemo(
			require("./demo-simple/index").default(),
			require("!!raw-loader!./demo-simple/index"),
			require("./demo-simple/docs.md")
		)
	)
	.add(
		"Simple flow example",
		Helper.makeDemo(require("./demo-simple-flow/index").default(), require("!!raw-loader!./demo-simple-flow/index"))
	)
	.add(
		"Performance demo",
		Helper.makeDemo(require("./demo-performance/index").default(), require("!!raw-loader!./demo-performance/index"))
	)
	.add(
		"Locked widget",
		Helper.makeDemo(require("./demo-locks/index").default(), require("!!raw-loader!./demo-locks/index"))
	)
	.add(
		"Canvas grid size",
		Helper.makeDemo(require("./demo-grid/index").default(), require("!!raw-loader!./demo-grid/index"))
	)
	.add(
		"Limiting link points",
		Helper.makeDemo(
			require("./demo-limit-points/index").default(),
			require("!!raw-loader!./demo-limit-points/index")
		)
	)
	.add(
		"Events and listeners",
		Helper.makeDemo(require("./demo-listeners/index").default(), require("!!raw-loader!./demo-listeners/index"))
	)
	.add(
		"Zoom to fit",
		Helper.makeDemo(require("./demo-zoom-to-fit/index").default(), require("!!raw-loader!./demo-zoom-to-fit/index"))
	)
	.add(
		"Links with labels",
		Helper.makeDemo(
			require("./demo-labelled-links/index").default(),
			require("!!raw-loader!./demo-labelled-links/index")
		)
	);

storiesOf("Advanced Techniques", module)
	.add(
		"Clone Selected",
		Helper.makeDemo(require("./demo-cloning/index").default(), require("!!raw-loader!./demo-cloning/index"))
	)
	.add(
		"Serializing and de-serializing",
		Helper.makeDemo(require("./demo-serializing/index").default(), require("!!raw-loader!./demo-serializing/index"))
	)
	.add(
		"Programatically modifying graph",
		Helper.makeDemo(
			require("./demo-mutate-graph/index").default(),
			require("!!raw-loader!./demo-mutate-graph/index")
		)
	)
	.add(
		"Large application",
		Helper.makeDemo(
			require("./demo-drag-and-drop/index").default(),
			require("!!raw-loader!./demo-drag-and-drop/components/BodyWidget")
		)
	)
	.add(
		"Smart routing",
		Helper.makeDemo(
			require("./demo-smart-routing/index").default(),
			require("!!raw-loader!./demo-smart-routing/index")
		)
	);

storiesOf("Custom Models", module)
	.add(
		"Custom diamond node",
		Helper.makeDemo(
			require("./demo-custom-node1/index").default(),
			require("!!raw-loader!./demo-custom-node1/index")
		)
	)
	.add(
		"Custom link sizes",
		Helper.makeDemo(
			require("./demo-custom-link1/index").default(),
			require("!!raw-loader!./demo-custom-link1/index")
		)
	);

storiesOf("3rd party libraries", module).add(
	"Auto Distribute (Dagre)",
	Helper.makeDemo(require("./demo-dagre/index").default(), require("!!raw-loader!./demo-dagre/index"))
);

// enable this to log mouse location when writing new puppeteer tests
//Helper.logMousePosition()
