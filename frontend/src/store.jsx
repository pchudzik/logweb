import {applyMiddleware, createStore} from "redux";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";
import reducer from "./reducers";

export default createStore(
	reducer,
	applyMiddleware(promise(), thunk));
