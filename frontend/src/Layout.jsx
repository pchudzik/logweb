import React from "react";
import {Provider} from "react-redux";
import Navigation from "./Navigation";
import MessageContainer from "./message/Messages";
import store from "./store";

import {addMessage} from "./message/messageActions";

store.dispatch(addMessage({
	type: "success",
	message: "component redux setup is working"
}));
store.dispatch(addMessage({
	type: "info",
	message: "component redux setup is working"
}));
store.dispatch(addMessage({
	type: "warning",
	message: "component redux setup is working"
}));
store.dispatch(addMessage({
	type: "danger",
	message: "component redux setup is working"
}));

const Layout = props => (
	<Provider store={store}>
		<div>
			<header>
				<Navigation />
			</header>

			<MessageContainer />

			<div className="container-fluid">
				{props.children}
			</div>
		</div>
	</Provider>
);
Layout.propTypes = {
	children: React.PropTypes.element
};

export default Layout;
