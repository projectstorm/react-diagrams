let glob = require("glob");
let webpack = require("webpack");
let path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

glob.glob(__dirname + "/../../demos/demo-*/index.tsx", {}, (err, files) => {

	let config = require("../../webpack.config");

	let entry = {};
	let copy = [];
	files.forEach((entryFile) => {
		entry[path.basename(path.dirname(entryFile))] = 'val-loader?entry='+entryFile+'!'+__dirname+"/entry.js";
		copy.push({to: path.basename(path.dirname(entryFile)), from: __dirname+"/index.html"});
	});

	webpack({
		entry: entry,
		plugins: [
			new CopyWebpackPlugin(copy)
		],
		output: {
			filename: '[name]/main.js',
			path: __dirname + '/../../dist/e2e',
		},
		module: {
			rules: [{
				test: /\.scss$/,
				use: ['style-loader','css-loader', 'sass-loader']
			}].concat(config.module.rules)
		},
		resolve: config.resolve,
	}, (err, stats) => {
		if (err || stats.hasErrors()) {
			// Handle errors here
			return;
		}
	});

});