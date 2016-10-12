import {combineReducers} from "redux";
import messages from "../message/messageReducer";
import providers from "../input/inputReducer";
import log from "../log/logReducer";

export default combineReducers({
	messages,
	providers,
	log
});
