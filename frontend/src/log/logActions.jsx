export const START_FOLLOWING = "START_FOLLOWING";
export const STOP_FOLLOWING = "STOP_FOLLOWING";

export function startFollowing(logName) {
	return {
		type: START_FOLLOWING,
		payload: logName
	};
}

export function stopFollowing(logName) {
	return {
		type: STOP_FOLLOWING,
		payload: logName
	};
}
