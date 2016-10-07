import {combineReducers} from "redux";
import messages from "../message/messageReducer";
import providers from "../home/providers/providersReducer";
import log from "../log/logReducer";

export default combineReducers({
	messages,
	providers,
	log
});
