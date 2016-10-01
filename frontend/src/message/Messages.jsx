import React from "react";
import {connect} from "react-redux";
import ErrorItem from "./Message";
import {removeMessage} from "./messageActions";

class MessageContainer extends React.Component {
	constructor() {
		super();
		this.closeMessage = this.closeMessage.bind(this);
	}

	closeMessage(error) {
		this.props.dispatch(removeMessage(error));
	}

	render() {
		const errorMessages = this.props.messages
			.map(error => (
				<ErrorItem
					key={error.id}
					type={error.type}
					message={error.message}
					dismiss={() => this.closeMessage(error)}/>
			));

		return (
			<div className="container-fluid">
				{errorMessages}
			</div>
		);
	}
}

MessageContainer.propTypes = {
	dispatch: React.PropTypes.func,
	messages: React.PropTypes.arrayOf(React.PropTypes.shape({
		/* eslint-disable react/no-unused-prop-types */
		id: React.PropTypes.number,
		message: React.PropTypes.string,
		type: React.PropTypes.oneOf(["success", "info", "warning", "danger"])
		/* eslint-enable react/no-unused-prop-types */
	}))
};

function stateMapper(state) {
	const {messages} = state;
	return {messages};
}
export default connect(stateMapper)(MessageContainer);
