import {addMessage} from "./messageActions";

export function dispatchErrorMessage(dispatch, error) {
	dispatch(addMessage({
		type: "danger",
		message: error
	}));
}

export function httpErrorMessage(error) {
	return `${error.response.status} - ${error.response.data}`;
}
