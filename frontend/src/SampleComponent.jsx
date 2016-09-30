import React from "react";

const SampleComponent = props => (
	(
		<div>
			<h1>Hello World!</h1>
			<p id="message">Message is &quot;{props.msg}&quot;</p>
		</div>
	));

SampleComponent.propTypes = {
	msg: React.PropTypes.string
};

SampleComponent.defaultProps = {
	msg: "default message"
};

export default SampleComponent;
