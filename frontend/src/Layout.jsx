import React from "react";
import {Provider} from "react-redux";
import NavigationBar from "./Navigation";
import MessageContainer from "./message/Messages";
import store from "./store";

const Layout = props => (
	<Provider store={store}>
		<div>
			<header>
				<NavigationBar />
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
