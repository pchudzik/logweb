import {
	START_FOLLOWING,
	STOP_FOLLOWING,
	LOG_EVENT
} from "./logActions";

const emptyFilter = {
	providers: []
};
const defaultLog = {
	logName: null,
	webSocket: null,
	events: [],
	filter: emptyFilter
};

export default function logReducer(state = defaultLog, action) {
	switch (action.type) {
		case START_FOLLOWING:
			return {
				events: [],
				logName: action.payload.logName,
				webSocket: action.payload.webSocket,
				filter: emptyFilter
			};
		case STOP_FOLLOWING:
			return {
				events: [],
				logName: null,
				webSocket: null,
				filter: emptyFilter
			};
		case LOG_EVENT: {
			return {
				...state,
				events: [...state.events, JSON.parse(action.payload.data)]
			};
		}
		default:
			return state;
	}
}
