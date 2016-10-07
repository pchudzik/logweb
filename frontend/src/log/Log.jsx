import React from "react";
import {connect} from "react-redux";
import {startFollowing, stopFollowing} from "./logActions";

export class Log extends React.Component {
	constructor() {
		super();
		this.getLogName = this.getLogName.bind(this);
	}

	componentWillMount() {
		this.props.dispatch(startFollowing(this.getLogName()));
	}

	componentWillUnmount() {
		this.props.dispatch(stopFollowing(this.getLogName()));
	}

	getLogName() {
		return this.props.params.logName;
	}

	render() {
		return (<h4>Following {this.getLogName()}</h4>);
	}
}
Log.propTypes = {
	dispatch: React.PropTypes.func,
	params: React.PropTypes.shape({
		logName: React.PropTypes.string
	})
};

export default connect(state => state.log)(Log);
