const path = require("path");
module.exports = {
	"preset": "jest-puppeteer",
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
		'^.+\\.jsx?$': 'babel-jest'
	},
	moduleNameMapper: {
		"\\.(scss|css|png)$": path.join(__dirname, "tests-e2e", "helpers", "css-mock.js"),
	},
	roots:[
		path.join(__dirname, 'tests-e2e'),
		path.join(__dirname, 'tests-snapshots')
	],
	testMatch: [
		"**/*\.test\.ts"
	]
};
