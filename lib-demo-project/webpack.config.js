const path = require('path');
const production = process.env.NODE_ENV === 'production';
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: production ? 'production' : 'development',
	devtool: 'inline-source-map',
	entry: './src/main.tsx',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					ecma: 6
				}
			})
		]
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true
				}
			}
		]
	},

	devServer: {
		host: '0.0.0.0',
		compress: true,
		port: 9000,
		disableHostCheck: true,
		overlay: true
	}
};
