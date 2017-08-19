var webpack = require("webpack");
var plugins = [];

//do we minify it all
if(process.env.NODE_ENV === 'production'){
	console.log("creating production build");
	plugins.push(new webpack.optimize.UglifyJsPlugin({
		mangle: {
			keep_fnames: true
		},
		compress: {
			keep_fnames: true,
			warnings: false,
		}
	}));
	plugins.push(new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify('production')
	}));
}

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
		plugins:plugins,
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
		devtool: process.env.NODE_ENV === 'production'?false:'eval-cheap-module-source-map'
	},
	//for building the demos and tests
	{
		entry: {
			'demo1/dist/bundle.js': './demos/demo1/index.tsx',
			'demo2/dist/bundle.js': './demos/demo2/index.tsx',
			'demo3/dist/bundle.js': './demos/demo3/index.tsx',
			'demo4/dist/bundle.js': './demos/demo4/index.tsx',
			'demo5/dist/bundle.js': './demos/demo5/index.tsx',
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
		plugins:plugins,
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
		devtool: process.env.NODE_ENV === 'production'?false:'eval-cheap-module-source-map'
	}
];
