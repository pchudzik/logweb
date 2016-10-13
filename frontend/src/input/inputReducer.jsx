import {
	FETCH_INPUTS_PENDING,
	FETCH_INPUTS_FULFILLED,
	FETCH_INPUTS_REJECTED
} from "./inputActions";
import {
	emptyRequest,
	errorRequest,
	fulfilledRequest,
	pendingRequest
} from "./requestState";

const defaultInputsState = {
	inputs: [],
	request: emptyRequest()
};

export default function inputReducer(state = defaultInputsState, action) {
	switch (action.type) {
		case FETCH_INPUTS_PENDING:
			return {
				...state,
				request: pendingRequest()
			};
		case FETCH_INPUTS_FULFILLED:
			return {
				...state,
				inputs: action.payload,
				request: fulfilledRequest()
			};
		case FETCH_INPUTS_REJECTED:
			return {
				...state,
				request: errorRequest(action.payload)
			};
		default:
			return state;
	}
}
