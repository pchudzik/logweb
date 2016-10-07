import React from "react";
import {Link} from "react-router";

export default ProviderItem;

function ProviderItem(props) {
	const providerName = props.provider.name;
	const providerUrl = `/log/${providerName}`;
	return (
		<tr>
			<td className="provider-name">
				<Link to={providerUrl}>
					{providerName}
				</Link>
			</td>
		</tr>
	);
}

ProviderItem.propTypes = {
	provider: React.PropTypes.shape({
		name: React.PropTypes.string
	})
};
