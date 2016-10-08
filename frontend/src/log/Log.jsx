import React from "react";
import {connect} from "react-redux";
import LogEntry from "./LogEntry";
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
		this.props.dispatch(stopFollowing(this.getLogName(), this.getWebSocket()));
	}

	getLogName() {
		return this.props.params.logName;
	}

	getWebSocket() {
		return this.props.webSocket;
	}

	render() {
		const events = this.props.events
			.map((event, index) => <LogEntry key={`${event.timestamp}-${index}`} logMessage={event.data}/>);
		return (
			<div>
				{events}
			</div>
		);
	}
}
Log.propTypes = {
	dispatch: React.PropTypes.func,
	params: React.PropTypes.shape({
		logName: React.PropTypes.string
	}),
	events: React.PropTypes.arrayOf(React.PropTypes.shape({
		data: React.PropTypes.string,
		timestamp: React.PropTypes.number,
		providerName: React.PropTypes.string
	})),
	webSocket: React.PropTypes.object 		// eslint-disable-line react/forbid-prop-types
};

export default connect(state => state.log)(Log);
