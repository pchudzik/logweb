import {
	START_FOLLOWING,
	STOP_FOLLOWING
} from "./logActions";

const defaultLog = {
	logName: null
};

export default function logReducer(state = defaultLog, action) {
	switch (action.type) {
		case START_FOLLOWING:
			return {
				...state,
				logName: action.payload
			};
		case STOP_FOLLOWING:
			return {
				...state,
				logName: null
			};
		default:
			return state;
	}
}
