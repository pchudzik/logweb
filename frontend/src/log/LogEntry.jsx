import React from "react";

export default LogEntry;

function LogEntry(props) {
	return (
		<span className="log-content">{props.logMessage}</span>
	);
}

LogEntry.propTypes = {
	logMessage: React.PropTypes.string
};
