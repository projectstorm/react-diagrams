import * as React from "react";
import { withDocs } from "storybook-readme";
import { WithCode } from "../../.storybook/addon-code/react.js";

export class Helper {
	/**
	 * Logs the mouse position in the console, but overlays a div that consumes all events
	 * since the actual story book stories are rendered as an iFrame.
	 */
	static logMousePosition() {
		let element = window.parent.document.createElement("mouse-position");
		element.style.position = "absolute";
		element.style.top = "0px";
		element.style.left = "0px";
		element.style.bottom = "0px";
		element.style.right = "0px";
		element.style.zIndex = "10";
		window.parent.document.body.appendChild(element);

		window.parent.window.addEventListener("mousemove", event => {
			console.clear();
			console.log(event.clientX, event.clientY);
		});
	}

	static makeDemo(widget, code, markdown?) {
		let container = () => <WithCode code={code}>{widget}</WithCode>;
		if (markdown) {
			return withDocs({
				PreviewComponent: ({ children }) => {
					return <div className="docs-preview-wrapper">{children}</div>;
				}
			})(markdown, container);
		}
		return container;
	}
}
