import {
	resolveHost,
	resolvePort
} from "./hostHelper";

export const TOGGLE_FOLLOW_LOG = "TOGGLE_FOLLOW_LOG";
export const TOGGLE_PROVIDR_FILTER = "TOGGLE_PROVIDER_FILTER";
export const START_FOLLOWING = "START_FOLLOWING";
export const STOP_FOLLOWING = "STOP_FOLLOWING";
export const LOG_EVENT = "LOG_EVENT";

export function toggleFollowLog() {
	return {type: TOGGLE_FOLLOW_LOG};
}

export function toggleProviderFilter(providerName) {
	return {
		type: TOGGLE_PROVIDR_FILTER,
		payload: providerName
	};
}

export function stopFollowing(logName, webSocket) {
	webSocket.onmessage = null;		// eslint-disable-line no-param-reassign
	webSocket.close();
	return {
		type: STOP_FOLLOWING,
		payload: {
			logName,
			webSocket: null
		}
	};
}

export function startFollowing(logName) {
	return dispatch => {
		const host = resolveHost(window);
		const port = resolveBackendPort();
		const webSocket = new window.WebSocket(`ws://${host}:${port}/api/ws/${logName}`);

		dispatch({
			type: START_FOLLOWING,
			payload: {
				logName,
				webSocket
			}
		});

		webSocket.onmessage = event => dispatch({
			type: LOG_EVENT,
			payload: event
		});
	};
}

function resolveBackendPort() {
	if (process.env.BACKEND_PORT) {
		return parseInt(process.env.BACKEND_PORT, 10);
	}

	return resolvePort(window);
}
