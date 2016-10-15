import React from "react";
import classnames from "classnames";
import {connect} from "react-redux";
import {
	toggleFollowLog,
	toggleProviderFilter
} from "./logActions";
import {fetchInputDetails} from "../input/inputDetailsActions";
import ProvidersFilterToggle from "./ProvidersFilterToggle";
import "./logActionsPanel.scss";


export class LogActions extends React.Component {
	constructor(props) {
		super(props);

		this.toggleFollowing = this.toggleFollowing.bind(this);
		this.toggleProvider = this.toggleProvider.bind(this);
	}

	componentWillMount() {
		this.props.dispatch(fetchInputDetails(this.props.logName));
	}

	toggleFollowing() {
		this.props.dispatch(toggleFollowLog());
	}

	toggleProvider(provider) {
		this.props.dispatch(toggleProviderFilter(provider));
	}

	render() {
		return (
			<div className="log-actions pull-right">
				<ProvidersFilterToggle
					providers={this.props.providers}
					providersFilter={this.props.providersFilter}
					onToggleProvider={this.toggleProvider}/>

				<div>
					<button
						className={classnames("btn", "btn-default", "btn-toggle-follow", {active: this.props.isFollowingActive})}
						onClick={this.toggleFollowing}>
						Toggle follow
						<i className="fa fa-cog fa-spin fa-1x fa-fw" />
					</button>
				</div>
			</div>
		);
	}
}

LogActions.propTypes = {
	isFollowingActive: React.PropTypes.bool,
	logName: React.PropTypes.string,
	providers: React.PropTypes.arrayOf(React.PropTypes.shape({
		name: React.PropTypes.string
	})),
	providersFilter: React.PropTypes.arrayOf(React.PropTypes.string),
	dispatch: React.PropTypes.func
};

function mapToStateProps(state) {
	const {isFollowingActive, logName, filter} = state.log;
	const {providers} = state.inputDetails.details;
	return {
		isFollowingActive,
		logName,
		providersFilter: filter.providers,
		providers
	};
}

export default connect(mapToStateProps)(LogActions);
