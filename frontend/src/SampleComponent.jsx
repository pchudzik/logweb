import React from 'react';

export default class SampleComponent extends React.Component {
	render() {
		return <div>
			<h1>Hello World!</h1>
			<p>Message is "{this.props.msg}"</p>
		</div>
	}
}