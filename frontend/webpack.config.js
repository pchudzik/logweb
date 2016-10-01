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
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: "babel-loader"
		}]
	},
	output: {
		path: path.join(__dirname, "/build/"),
		filename: "app.min.js"
	},
	plugins: debug ? [
		new HtmlWebpackPlugin({template: "index.html.template"}),
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
};
