import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

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
						<a className="navbar-brand logo" href="https://github.com/pchudzik/logweb" target="_blank" rel="noopener noreferrer">
							github
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
