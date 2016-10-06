import {combineReducers} from "redux";
import messages from "../message/messageReducer";
import providers from "../home/providers/providersReducer";

export default combineReducers({
	messages,
	providers
});
