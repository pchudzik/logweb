var debug = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
	context: path.join(__dirname, 'src'),
	devtool: debug ? 'inline-sourcemap': null,
	entry: './app.jsx',
	module: {
		loader: {
			test: /\.jsx$/,
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				presets:['es2015','stage-0', 'react'],
				plugins: ['react-html-attrs','transform-class-properties', 'transform-decorators-legacy']
			}
		}
	},
	output: {
		path: __dirname + '/build/',
		filename: 'app.min.js',
	},
	plugins: debug ? [
		new HtmlWebpackPlugin({template: 'index.html.template'}),
		new webpack.optimize.DedupePlugin(),
    	new webpack.optimize.OccurenceOrderPlugin()
    ]: []
}
