// jest.config.js
module.exports = {
	verbose: true,
	moduleFileExtensions: [
		"ts",
		"tsx",
		"js",
		"jsx",
		"json",
		"node"
	],
	transform: {
		".*test_loader.*": __dirname+"/tests/helpers/storybook-loader.js",
		"^.+\\.tsx?$": "ts-jest",
	},
	moduleNameMapper:{
		"\\.(scss|css|png)$": __dirname+"/tests/helpers/css-mock.js"
	},
	roots:[
		__dirname+'/tests'
	],
	testMatch: [
		"**/*\.test\.tsx"
	]
};
