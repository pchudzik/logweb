export const ADD_MESSAGE = "ADD_MESSAGE";
export const REMOVE_MESSAGE = "REMOVE_MESSAGE";

let errorId = 1;

export function addMessage(error) {
	return {
		type: ADD_MESSAGE,
		payload: {
			...error,
			id: incrementAndGetErrorId()
		}
	};
}

export function removeMessage(error) {
	return {
		type: REMOVE_MESSAGE,
		payload: error
	};
}

function incrementAndGetErrorId() {
	errorId += 1;
	return errorId;
}
