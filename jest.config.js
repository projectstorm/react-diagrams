const path = require("path");
// jest.config.js
module.exports = {
	"preset": "jest-puppeteer",
	transform: {
		".*test_loader.*": path.join(__dirname, "tests", "helpers", "storybook-loader.js" ),
		'^.+\\.tsx?$': 'ts-jest',
		'^.+\\.jsx?$': 'babel-jest'
	},
	moduleNameMapper: {
		"\\.(scss|css|png)$": path.join(__dirname, "tests", "helpers", "css-mock.js"),
		"storm-react-diagrams": path.join(__dirname, "src", "main")
	},
	roots:[
		__dirname+'/tests'
	],
	testMatch: [
		"**/*\.test\.ts"
	]
};
