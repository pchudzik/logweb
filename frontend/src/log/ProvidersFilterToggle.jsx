import React from "react";
import classnames from "classnames";

export default class ProvidersFilterToggle extends React.Component {
	constructor(props) {
		super(props);

		this.isProviderFilterActive = this.isProviderFilterActive.bind(this);
	}

	isProviderFilterActive(provider) {
		const noFilterSelected = this.props.providersFilter.length === 0;
		const filteringByProvider = this.props.providersFilter.includes(provider.name);
		return noFilterSelected || filteringByProvider;
	}

	render() {
		if (1 >= this.props.providers.length) {
			return null;
		}

		const providersToggles = this.props.providers.map(provider => {
			const buttonClasses = classnames(
				"btn", "btn-default btn-toggle-provider",
				{active: this.isProviderFilterActive(provider)});
			return (
				<button
					key={provider.name}
					className={buttonClasses}
					onClick={() => this.props.onToggleProvider(provider)}>
					<i className="fa fa-check-square"/>
					{provider.name}
				</button>
			);
		});

		return (
			<div className="btn-group btn-group-xs" data-toggle="buttons">
				{providersToggles}
			</div>
		);
	}
}

ProvidersFilterToggle.propTypes = {
	providers: React.PropTypes.arrayOf(React.PropTypes.shape({
		name: React.PropTypes.string
	})),
	providersFilter: React.PropTypes.arrayOf(React.PropTypes.string),
	onToggleProvider: React.PropTypes.func
};

