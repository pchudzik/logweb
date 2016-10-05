import axios from "axios";
import {addMessage} from "../../message/messageActions";

const FETCH_PROVIDERS = "FETCH_PROVIDERS";
export const FETCH_PROVIDERS_PENDING = FETCH_PROVIDERS + "_PENDING";
export const FETCH_PROVIDERS_FULFILLED = FETCH_PROVIDERS + "_FULFILLED";
export const FETCH_PROVIDERS_REJECTED = FETCH_PROVIDERS + "_REJECTED";

export function fetchProviders() {
	return dispatch => {
		dispatch({type: FETCH_PROVIDERS_PENDING});

		return axios
			.get("http://example.com/api/inputs")
			.then(response => dispatch({type: FETCH_PROVIDERS_FULFILLED, payload: response.data}))
			.catch(error => {
				dispatchErrorMessage(dispatch, error);
				dispatchPromiseRejection(dispatch, error);
			});
	};
}

function dispatchPromiseRejection(dispatch, error) {
	dispatch({type: FETCH_PROVIDERS_REJECTED, payload: error});
}
function dispatchErrorMessage(dispatch, error) {
	dispatch(addMessage({
		type: "danger",
		message: `${error.response.status} - ${error.response.data}`
	}));
}
