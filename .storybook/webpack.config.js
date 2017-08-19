const path = require('path');
module.exports = {
	module: {
		rules: [
			{
				test: /\.scss$/,
				loaders: ["style-loader", "css-loader", "sass-loader"],
				include: path.resolve(__dirname, '../')
			},
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: "source-map-loader"
			},
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader',
			}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	}
};