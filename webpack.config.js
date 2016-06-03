var webpack = require("webpack");
var path = require("path");
module.exports = {
	watch: true,
	entry: "./tests/test.js",
	output: {
		path: path.resolve(__dirname, "tests"),
		filename: "bundle.js"
	},
	plugins: [
		new webpack.optimize.DedupePlugin()
	],
	module: {
		loaders: [
			{
				test: /\.scss$/,
				loaders: ["style", "css", "sass"]
			}
		]
	},
	devServer: {
		contentBase: "./tests",
	}
};
