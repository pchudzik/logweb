import React from "react";

export default function SampleComponent() {
	return (
		<div>
			<h1>Hello World!</h1>
			<p id="message">Message is &quote;{this.props.msg}&quote;</p>
		</div>
	);
}
