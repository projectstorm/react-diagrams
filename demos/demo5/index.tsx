import * as React from "react";
import * as ReactDOM from "react-dom";

import {BodyWidget} from "./components/BodyWidget";
import {Application} from "./Application";

require("./sass/main.scss");

window.onload = () => {

	var app = new Application();

	ReactDOM.render(<BodyWidget app={app} />, document.body);

}