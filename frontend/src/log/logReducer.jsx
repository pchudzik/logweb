import {
	START_FOLLOWING,
	STOP_FOLLOWING,
	TOGGLE_FOLLOW_LOG,
	TOGGLE_PROVIDR_FILTER,
	LOG_EVENT
} from "./logActions";

const emptyFilter = {
	providers: []
};
const defaultLog = {
	logName: null,
	webSocket: null,
	isFollowingActive: false,
	events: [],
	filter: emptyFilter
};

export default function logReducer(state = defaultLog, action) {
	switch (action.type) {
		case START_FOLLOWING:
			return {
				...state,
				isFollowingActive: true,
				logName: action.payload.logName,
				webSocket: action.payload.webSocket
			};
		case STOP_FOLLOWING:
			return {
				events: [],
				logName: null,
				isFollowingActive: false,
				webSocket: null,
				filter: emptyFilter
			};
		case TOGGLE_FOLLOW_LOG:
			return {
				...state,
				isFollowingActive: !state.isFollowingActive
			};
		case TOGGLE_PROVIDR_FILTER:
			return {
				...state,
				filter: {
					providers: toggleProviders(state.filter.providers, action.payload)
				}
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

function toggleProviders(existingFilter, providerToToggle) {
	if (existingFilter.includes(providerToToggle.name)) {
		return existingFilter.filter(provider => provider !== providerToToggle.name);
	}
	return [...existingFilter, providerToToggle.name];
}
