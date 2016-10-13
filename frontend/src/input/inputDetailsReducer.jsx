import {
	FETCH_INPUT_DETAILS_REJECTED,
	FETCH_INPUT_DETAILS_FULFILLED,
	FETCH_INPUT_DETAILS_PENDING
} from "./inputDetailsActions";
import {
	emptyRequest,
	errorRequest,
	fulfilledRequest,
	pendingRequest
} from "./requestState";

const defaultInputDetailsState = {
	details: {
		name: null,
		providers: []
	},
	request: emptyRequest()
};

export default function inputDetailsReducer(state = defaultInputDetailsState, action) {
	switch (action.type) {
		case FETCH_INPUT_DETAILS_PENDING:
			return {
				...state,
				request: pendingRequest()
			};
		case FETCH_INPUT_DETAILS_REJECTED:
			return {
				...state,
				request: errorRequest(action.payload)
			};
		case FETCH_INPUT_DETAILS_FULFILLED:
			return {
				...state,
				details: {
					name: action.payload.name,
					providers: action.payload.providers
				},
				request: fulfilledRequest()
			};
		default:
			return state;
	}
}
