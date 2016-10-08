import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import "./navigation.scss";

export function Navigation(props) {
	const logName = props.logName;
	const logNameText = logName ? (<p className="navbar-text">Following {logName}</p>) : null;

	return (
		<nav className="navbar navbar-default navbar-fixed-top">
			<div className="container-fluid">
				<div className="navbar-header">
					<Link className="navbar-brand" to="/">Logweb</Link>
				</div>

				<div className="collapse navbar-collapse">
					{logNameText}
					<div className="nav navbar-nav navbar-right">
						<a className="navbar-brand logo github-link" href="https://github.com/pchudzik/logweb" target="_blank" rel="noopener noreferrer">
							<i className="fa fa-2x fa-github" />
						</a>
					</div>
				</div>
			</div>
		</nav>
	);
}
Navigation.propTypes = {
	logName: React.PropTypes.string
};

export default connect(state => state.log)(Navigation);
