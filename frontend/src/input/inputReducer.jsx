import {
	FETCH_INPUTS_PENDING,
	FETCH_INPUTS_FULFILLED,
	FETCH_INPUTS_REJECTED
} from "./inputActions";

const defaultInputsState = {
	inputs: [],
	request: {
		fetching: false,
		fetched: false,
		error: null
	}
};

export default function inputReducer(state = defaultInputsState, action) {
	switch (action.type) {
		case FETCH_INPUTS_PENDING:
			return {
				...state,
				request: {
					fetching: true,
					fetched: false,
					error: null
				}
			};
		case FETCH_INPUTS_FULFILLED:
			return {
				...state,
				inputs: action.payload,
				request: {
					fetching: false,
					fetched: true,
					error: null
				}
			};
		case FETCH_INPUTS_REJECTED:
			return {
				...state,
				request: {
					fetching: false,
					fetched: false,
					error: action.payload
				}
			};
		default:
			return state;
	}
}
