import React from "react";
import {Link} from "react-router";

export default InputItem;

function InputItem(props) {
	const inputName = props.input.name;
	const inputUrl = `/log/${inputName}`;
	return (
		<tr>
			<td className="input-name">
				<Link to={inputUrl}>
					{inputName}
				</Link>
			</td>
		</tr>
	);
}

InputItem.propTypes = {
	input: React.PropTypes.shape({
		name: React.PropTypes.string
	})
};
