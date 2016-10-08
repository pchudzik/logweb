import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, hashHistory} from "react-router";
import Layout from "./Layout";
import HomePage from "./home/HomePage";
import LogView from "./log/Log";
import "./app.scss";

ReactDOM.render(
	(
		<Router history={hashHistory}>
			<Route path="/" component={Layout}>
				<IndexRoute component={HomePage} />
				<Route path="log/:logName" name="log" component={LogView} />
			</Route>
		</Router>
	),
	document.getElementById("app"));
