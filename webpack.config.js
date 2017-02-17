module.exports = {
	entry: './tests/test1/index.ts',
	output: {
		filename: 'bundle.js',
		path: './tests/test1'
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [{
                loader: "style-loader" // creates style nodes from JS strings
				}, {
					loader: "css-loader" // translates CSS into CommonJS
				}, {
					loader: "sass-loader" // compiles Sass to CSS
				}]
			},
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: "source-map-loader"
			},
			{
				test: /\.tsx?$/,
				loader: 'ts-loader?' + JSON.stringify({
					transpileOnly: true
				}),
				exclude: /node_modules/,
			},
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	devtool: 'source-map'
};
