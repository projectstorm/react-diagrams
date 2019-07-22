const production = process.env.NODE_ENV === "production";
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports =
	//for building the umd distribution
	{
		entry: "./src/main.ts",
		output: {
			filename: "main.js",
			path: __dirname + "/dist",
			libraryTarget: "umd",
			library: "storm-react-diagrams"
		},
		externals: [nodeExternals()],
		module: {
			rules: [
				{
					enforce: "pre",
					test: /\.js$/,
					loader: "source-map-loader"
				},
				{
					test: /\.tsx?$/,
					loader: "ts-loader"
				}
			]
		},
		resolve: {
			extensions: [".tsx", ".ts", ".js"]
		},
		devtool: production ? "source-map" : "cheap-module-source-map",
		mode: production ? "production" : "development",
		optimization: {
			minimizer: [new TerserPlugin()],
		}
	};
