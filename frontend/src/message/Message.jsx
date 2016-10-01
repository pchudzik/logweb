import React from "react";

export default MessageItem;

function MessageItem(props) {
	const itemClass = `alert alert-dismissible alert-${props.type}`;

	return (
		<div className={itemClass}>
			<button type="button" className="close" onClick={props.dismiss} aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			<span className="message">{props.message}</span>
		</div>
	);
}

MessageItem.propTypes = {
	type: React.PropTypes.string,
	message: React.PropTypes.string,
	dismiss: React.PropTypes.func
};
