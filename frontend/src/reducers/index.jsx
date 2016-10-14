import {combineReducers} from "redux";
import messages from "../message/messageReducer";
import inputs from "../input/inputReducer";
import inputDetails from "../input/inputDetailsReducer";
import log from "../log/logReducer";

export default combineReducers({
	messages,
	inputs,
	inputDetails,
	log
});
