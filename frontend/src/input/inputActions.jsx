import axios from "axios";
import {
	dispatchErrorMessage,
	httpErrorMessage
} from "../message/dispatchMessage";

const FETCH_INPUTS = "FETCH_INPUTS";
export const FETCH_INPUTS_PENDING = FETCH_INPUTS + "_PENDING";
export const FETCH_INPUTS_FULFILLED = FETCH_INPUTS + "_FULFILLED";
export const FETCH_INPUTS_REJECTED = FETCH_INPUTS + "_REJECTED";

export function fetchInputs() {
	return dispatch => {
		dispatch({type: FETCH_INPUTS_PENDING});

		return axios
			.get("/api/inputs")
			.then(response => dispatch({type: FETCH_INPUTS_FULFILLED, payload: response.data}))
			.catch(error => {
				dispatchErrorMessage(dispatch, httpErrorMessage(error));
				dispatchPromiseRejection(dispatch, error);
			});
	};
}

function dispatchPromiseRejection(dispatch, error) {
	dispatch({type: FETCH_INPUTS_REJECTED, payload: error});
}
