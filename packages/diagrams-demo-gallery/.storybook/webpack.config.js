const path = require('path');
module.exports = async ({ config, mode }) => {
	return {
		...config,
		resolve: {
			...config.resolve,
			extensions: ['.tsx', '.ts', '.js']
		},
		module: {
			...config.module,
			rules: [
				...config.module.rules,
				...[
					{
						test: /\.scss$/,
						loaders: [
							'style-loader',
							'css-loader',
							{
								loader: 'postcss-loader',
								options: { config: { path: path.join(__dirname, '..') } }
							}
						]
					},
					{
						enforce: 'pre',
						test: /\.js$/,
						loader: 'source-map-loader',
						exclude: [/node_modules/]
					},
					{
						test: /\.tsx?$/,
						exclude: /node_modules/,
						loader: 'ts-loader',
						options: {
							transpileOnly: true
						}
					}
				]
			]
		}
	};
};
