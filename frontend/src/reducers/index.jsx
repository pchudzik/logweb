import {combineReducers} from "redux";
import messages from "../message/messageReducer";
import inputs from "../input/inputReducer";
import log from "../log/logReducer";

export default combineReducers({
	messages,
	inputs,
	log
});
