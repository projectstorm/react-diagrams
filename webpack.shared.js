const production = process.env.NODE_ENV === "production";
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = (directory) => {
	return {
		entry: path.join(directory, 'index.ts'),
		output: {
			filename: "index.js",
			path: path.join(directory, 'dist'),
			libraryTarget: "umd",
		},
		externals: [
			nodeExternals({modulesDir: path.join(directory, 'node_modules')}),
			nodeExternals({modulesDir: path.join(__dirname, 'node_modules')})
		],
		module: {
			rules: [
				{
					test: /\.scss$/,
					use: ['style-loader', 'css-loader', 'sass-loader']
				},
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
	}
};
