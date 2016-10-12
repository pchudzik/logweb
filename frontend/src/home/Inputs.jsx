import React from "react";
import {connect} from "react-redux";
import {fetchInputs} from "../input/inputActions";
import InputsHeader from "./InputsHeader";
import InputItem from "./Input";

export class Inputs extends React.Component {
	componentWillMount() {
		this.props.dispatch(fetchInputs());
	}

	render() {
		const allInputs = this.props.inputs
			.map(input => <InputItem key={input.name} input={input}/>);

		return (
			<div className="container-fluid">
				<table className="table table-hover table-condensed">
					<thead>
						<InputsHeader />
					</thead>
					<tbody>
						{allInputs}
					</tbody>
				</table>
			</div>
		);
	}
}

Inputs.propTypes = {
	dispatch: React.PropTypes.func,
	inputs: React.PropTypes.arrayOf(React.PropTypes.shape({
		name: React.PropTypes.string
	}))
};

function inputsMapper(state) {
	return {inputs: state.inputs.inputs};
}

export default connect(inputsMapper)(Inputs);
