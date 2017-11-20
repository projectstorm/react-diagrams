import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import demo1 from "./demo1/index";
import demo2 from "./demo2/index";
import demo3 from "./demo3/index";
import demo4 from "./demo4/index";
import demo5 from "./demo5/index";
import demo6 from "./demo6/index";
import demo7 from "./demo7/index";
import demo8 from "./demo8/index";
import demo9 from "./demo9/index";

require("./test.scss");

storiesOf("React Diagrams", module)
	.add("Simple Example", () => {
		return demo1();
	})
	.add("Performance Test", () => {
		return demo2();
	})
	.add("Custom Diamond Widget", () => {
		return demo3();
	})
	.add("Locked Widget", () => {
		return demo4();
	})
	.add("Embedded diagram", () => {
		return demo5();
	})
	.add("Serializing and Deserializing", () => {
		return demo6();
	})
	.add("Grid Size", () => {
		return demo7();
	})
	.add("Limiting number of points", () => {
		return demo8();
	})
	.add("Events", () => {
		return demo9();
	});
