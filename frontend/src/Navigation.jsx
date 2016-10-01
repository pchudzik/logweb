import React from "react";
import {Link} from "react-router";

const Navigation = () => (
	<nav className="navbar navbar-default navbar-fixed-top">
		<div className="container-fluid">
			<div className="navbar-header">
				<Link className="navbar-brand" to="/">Logweb</Link>
			</div>

			<div className="collapse navbar-collapse">
				<div className="nav navbar-nav navbar-right">
					<a className="navbar-brand logo" href="https://github.com/pchudzik/logweb" target="_blank" rel="noopener noreferrer">
						github
					</a>
				</div>
			</div>
		</div>
	</nav>
);

export default Navigation;
