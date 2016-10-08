import {
	resolveHost,
	resolvePort		// eslint-disable-line no-unused-vars
} from "./hostHelper";

export const START_FOLLOWING = "START_FOLLOWING";
export const STOP_FOLLOWING = "STOP_FOLLOWING";
export const LOG_EVENT = "LOG_EVENT";

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
		// TODO fixme configure webpack dev server to proxy ws requests - https://github.com/pchudzik/logweb/issues/21
		// const port = resolvePort(window);
		const port = 8008;
		const webSocket = new window.WebSocket(`ws://${host}:${port}/${logName}`);

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
