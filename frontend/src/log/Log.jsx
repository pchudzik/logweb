import React from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import scroll from "react-scroll";
import LogEntry from "./LogEntry";
import {startFollowing, stopFollowing} from "./logActions";
import "./log.scss";

export class Log extends React.Component {
	constructor(props) {
		super(props);

		this.state = {followingActive: true};
		this.getLogName = this.getLogName.bind(this);
		this.toggleFollow = this.toggleFollow.bind(this);
	}

	componentWillMount() {
		this.props.dispatch(startFollowing(this.getLogName()));
	}

	componentDidUpdate() {
		if (this.state.followingActive) {
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

	toggleFollow() {
		this.setState({
			followingActive: !this.state.followingActive
		});
	}

	render() {
		const events = this.props.events
			.map((event, index) => <LogEntry key={`${event.timestamp}-${index}`} logMessage={event.data}/>);
		return (
			<div>
				<div className="toggle-follow">
					<button
						className={classnames("btn", "btn-default", {active: this.state.followingActive})}
						onClick={this.toggleFollow}>
						Toggle follow
					</button>
				</div>
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
	events: React.PropTypes.arrayOf(React.PropTypes.shape({
		data: React.PropTypes.string,
		timestamp: React.PropTypes.number,
		providerName: React.PropTypes.string
	})),
	webSocket: React.PropTypes.object 		// eslint-disable-line react/forbid-prop-types
};

export default connect(state => state.log)(Log);
