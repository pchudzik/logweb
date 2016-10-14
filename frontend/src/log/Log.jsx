import React from "react";
import {connect} from "react-redux";
import scroll from "react-scroll";
import LogEntry from "./LogEntry";
import {
	startFollowing,
	stopFollowing
} from "./logActions";
import {fetchInputDetails} from "../input/inputDetailsActions";
import filterEvents from "./eventsFilter";
import LogActionsPanel from "./LogActionsPanel";

export class Log extends React.Component {
	constructor(props) {
		super(props);

		this.getLogName = this.getLogName.bind(this);
	}

	componentWillMount() {
		this.props.dispatch(startFollowing(this.getLogName()));
		this.props.dispatch(fetchInputDetails(this.getLogName()));
	}

	componentDidUpdate() {
		if (this.props.isFollowingActive) {
			scroll.animateScroll.scrollToBottom({
				duration: 500
			});
		}
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
				<LogActionsPanel/>
				<div className="log-data">
					{events}
				</div>

				<div className="log-spinner">
					<i className="fa fa-spinner fa-spin fa-2x fa-fw"/>
				</div>
			</div>
		);
	}
}

Log.propTypes = {
	dispatch: React.PropTypes.func,
	params: React.PropTypes.shape({
		logName: React.PropTypes.string
	}),
	isFollowingActive: React.PropTypes.bool,
	events: React.PropTypes.arrayOf(React.PropTypes.shape({
		data: React.PropTypes.string,
		timestamp: React.PropTypes.number,
		providerName: React.PropTypes.string
	})),
	webSocket: React.PropTypes.object 		// eslint-disable-line react/forbid-prop-types
};

export function mapToStateProps(state) {
	return {
		...state.log,
		events: filterEvents(state.log.events, state.log.filter)
	};
}

export default connect(mapToStateProps)(Log);
