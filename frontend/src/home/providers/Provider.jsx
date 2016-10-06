import React from "react";

export default ProviderItem;

function ProviderItem(props) {
	return (
		<tr>
			<td className="provider-name">{props.provider.name}</td>
		</tr>
	);
}

ProviderItem.propTypes = {
	provider: React.PropTypes.shape({
		name: React.PropTypes.string
	})
};
