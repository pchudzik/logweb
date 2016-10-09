const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const htmlTemplate = require("html-webpack-template");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

const debug = process.env.NODE_ENV !== "production";
const commonPlugins = [
	new ProgressBarPlugin({
		format: "  build [:bar] :percent - :msg (:elapsed seconds)"
	}),
	new webpack.optimize.OccurenceOrderPlugin(),
	new HtmlWebpackPlugin({
		inject: false,
		template: htmlTemplate,
		appMountId: "app",
		title: "Logweb"
	})
];

const vendorsToSkip = ["font-awesome"];
const vendorModules = Object.keys(JSON.parse(fs.readFileSync("package.json")).dependencies)
	.filter(module => !vendorsToSkip.includes(module));

module.exports = {
	context: path.join(__dirname, "src"),
	devtool: debug ? "inline-sourcemap" : null,
	entry: {
		vendor: vendorModules,
		vendorCss: ["./vendor.scss"],
		app: "./app.jsx"
	},
	output: {
		path: path.join(__dirname, "../backend/public"),
		filename: "[name].js"
	},
	devServer: {
		proxy: {
			"/api": {
				target: "http://localhost:8008"
			}
		}
	},
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
				test: require.resolve("jquery"),
				loader: "expose?jQuery!expose?$"
			},
			{
				test: /bootstrap-sass\/assets\/javascripts\//,
				loader: "imports?jQuery=jquery"
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
	plugins: debug ? commonPlugins.concat([
		new webpack.DefinePlugin({
			"process.env.BACKEND_PORT": JSON.stringify(process.env.BACKEND_PORT)
		})
	]) : commonPlugins.concat([
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
		})
	])
};
