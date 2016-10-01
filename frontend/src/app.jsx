import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, hashHistory} from "react-router";
import Layout from "./Layout";
import HomePage from "./home/HomePage";

const Log = () => (<h1>Log page!</h1>);

ReactDOM.render(
	(
		<Router history={hashHistory}>
			<Route path="/" component={Layout}>
				<IndexRoute component={HomePage} />
				<Route path="log/:logName" name="log" component={Log} />
			</Route>
		</Router>
	),
	document.getElementById("app"));
