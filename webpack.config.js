/**
 * @author Dylan Vorster
 */
module.exports = [
	//for building the umd distribution
	{
		entry: './src/main.ts',
		output: {
			filename: 'main.js',
			path: __dirname + '/dist',
			libraryTarget: 'umd',
			library: 'storm-react-diagrams'
		},
		externals: {
			react: {
				root: 'React',
				commonjs2: 'react',
				commonjs: 'react',
				amd: 'react'
			},
			'react-dom': {
				root: 'ReactDOM',
				commonjs2: 'react-dom',
				commonjs: 'react-dom',
				amd: 'react-dom'
			},
			"lodash": {
				commonjs: 'lodash',
				commonjs2: 'lodash',
				amd: '_',
				root: '_'
			}
		},
		module: {
			rules: [
				{
					enforce: 'pre',
					test: /\.js$/,
					loader: "source-map-loader"
				},
				{
					test: /\.tsx?$/,
					loader: 'ts-loader?' + JSON.stringify({
						configFileName: 'tsconfig.json'
					})
				}
			]
		},
		resolve: {
			extensions: [".tsx", ".ts", ".js"]
		},
		devtool: 'source-map'
	},
	//for building the demos and tests
	{
		entry: {
			'demo1/bundle.js': './demos/demo1/index.ts',
			'demo2/bundle.js': './demos/demo2/index.ts',
			'demo3/bundle.js': './demos/demo3/index.ts',
			'demo4/bundle.js': './demos/demo4/index.ts',
		},
		output: {
			filename: '[name]',
			path: __dirname + '/demos',
			libraryTarget: 'umd',
			library: 'storm-react-diagrams'
		},
		externals: {
			react: {
				root: 'React',
				commonjs2: 'react',
				commonjs: 'react',
				amd: 'react'
			},
			'react-dom': {
				root: 'ReactDOM',
				commonjs2: 'react-dom',
				commonjs: 'react-dom',
				amd: 'react-dom'
			},
			"lodash": {
				commonjs: 'lodash',
				commonjs2: 'lodash',
				amd: '_',
				root: '_'
			}
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
						configFileName: 'tsconfig.json',
						compilerOptions: {
							declaration:false
						}
					}),
				}
			]
		},
		resolve: {
			extensions: [".tsx", ".ts", ".js"]
		},
		devtool: 'source-map'
	}
];
