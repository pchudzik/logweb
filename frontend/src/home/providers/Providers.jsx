import React from "react";
import {connect} from "react-redux";
import {fetchProviders} from "./providersActions";
import ProvidersHeader from "./ProvidersHeader";
import ProviderItem from "./Provider";

export class Providers extends React.Component {
	componentWillMount() {
		this.props.dispatch(fetchProviders());
	}

	render() {
		const allProviders = this.props.providers
			.map(provider => <ProviderItem key={provider.name} provider={provider}/>);

		return (
			<div className="container-fluid">
				<table className="table table-hover table-condensed">
					<thead>
						<ProvidersHeader />
					</thead>
					<tbody>
						{allProviders}
					</tbody>
				</table>
			</div>
		);
	}
}

Providers.propTypes = {
	dispatch: React.PropTypes.func,
	providers: React.PropTypes.arrayOf(React.PropTypes.shape({
		name: React.PropTypes.string
	}))
};

function providersMapper(state) {
	return state.providers;
}

export default connect(providersMapper)(Providers);
