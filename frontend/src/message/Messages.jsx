import React from "react";
import {connect} from "react-redux";
import Message from "./Message";
import {removeMessage} from "./messageActions";

export class Messages extends React.Component {
	constructor() {
		super();
		this.closeMessage = this.closeMessage.bind(this);
	}

	closeMessage(message) {
		this.props.dispatch(removeMessage(message));
	}

	render() {
		const errorMessages = this.props.messages
			.map(error => (
				<Message
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

Messages.propTypes = {
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
	return {messages: state.messages};
}
export default connect(stateMapper)(Messages);
