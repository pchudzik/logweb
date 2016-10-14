import React from "react";
import classnames from "classnames";
import {connect} from "react-redux";
import {toggleFollowLog} from "./logActions";
import "./logActionsPanel.scss";


export class LogActions extends React.Component {
	constructor(props) {
		super(props);
		this.toggleFollowing = this.toggleFollowing.bind(this);
	}

	toggleFollowing() {
		this.props.dispatch(toggleFollowLog());
	}

	render() {
		return (
			<div className="log-actions">
				<button
					className={classnames("btn", "btn-default", "toggle-follow", {active: this.props.isFollowingActive})}
					onClick={this.toggleFollowing}>
					Toggle follow
				</button>
			</div>
		);
	}
}

LogActions.propTypes = {
	isFollowingActive: React.PropTypes.bool,
	dispatch: React.PropTypes.func
};

function mapToStateProps(state) {
	const {isFollowingActive} = state.log;
	return {isFollowingActive};
}

export default connect(mapToStateProps)(LogActions);
