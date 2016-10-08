const debug = process.env.NODE_ENV !== "production";
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
	context: path.join(__dirname, "src"),
	devtool: debug ? "inline-sourcemap" : null,
	entry: "./app.jsx",
	resolve: {
		extensions: ["", ".js", ".jsx"]
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			},
			{
				test: /\.scss$/,
				loaders: ["style", "css?sourceMap", "sass?sourceMap"]
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?name=fonts/[name].[ext]"
			},
			{
				test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?name=fonts/[name].[ext]"
			},
			{
				test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?name=fonts/[name].[ext]"
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?name=fonts/[name].[ext]"
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?name=fonts/[name].[ext]"
			}
		]
	},
	output: {
		path: path.join(__dirname, "/build"),
		filename: "app.min.js"
	},
	plugins: debug ? [
		new HtmlWebpackPlugin({template: "index.html.template"}),
		new webpack.DefinePlugin({
			"process.env.BACKEND_PORT": JSON.stringify(process.env.BACKEND_PORT)
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin()
	] : [],
	devServer: {
		proxy: {
			"/api": {
				target: "http://localhost:8008"
			}
		}
	}
}
;
