function answer(options, a, b) {
	return {
		code:
			`
			var demo = require("` +
			options.entry +
			`");
			var ReactDOM = require("react-dom");
			var srd = require("../../src/main.ts");
			srd.Toolkit.TESTING = true;
			var styles = require("` +
			(__dirname + '/../../demos/.helpers/demo.scss') +
			`");
			window.onload = function(){
				ReactDOM.render(demo.default(),document.querySelector("#application"));
			};
		`
	};
}

module.exports = answer;
