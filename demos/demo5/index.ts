import * as SRD from "../../src/main";
import * as React from "react";
import * as ReactDOM from "react-dom";

import {BodyWidgetFactory} from "./components/BodyWidget";
import {Application} from "./Application";

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

require("./sass/main.scss");

window.onload = () => {
	
	var app = new Application();
	
	ReactDOM.render(BodyWidgetFactory({app:app}), document.body);
	
}