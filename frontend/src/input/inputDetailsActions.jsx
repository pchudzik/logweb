import axios from "axios";
import {
	dispatchErrorMessage,
	httpErrorMessage
} from "../message/dispatchMessage";

const FETCH_INPUT_DETAILS = "FETCH_INPUT_DETAILS";
export const FETCH_INPUT_DETAILS_PENDING = FETCH_INPUT_DETAILS + "_PENDING";
export const FETCH_INPUT_DETAILS_FULFILLED = FETCH_INPUT_DETAILS + "_FULFILLED";
export const FETCH_INPUT_DETAILS_REJECTED = FETCH_INPUT_DETAILS + "_REJECTED";

export function fetchInputDetails(inputName) {
	return dispatch => {
		dispatch({type: FETCH_INPUT_DETAILS_PENDING});

		axios
			.get(`/api/inputs/${inputName}`)
			.then(response => dispatch({type: FETCH_INPUT_DETAILS_FULFILLED, payload: response.data}))
			.catch(error => {
				dispatch({type: FETCH_INPUT_DETAILS_REJECTED, payload: error});
				dispatchErrorMessage(dispatch, httpErrorMessage(error));
			});
	};
}
