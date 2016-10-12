import {
	FETCH_PROVIDERS_PENDING,
	FETCH_PROVIDERS_FULFILLED,
	FETCH_PROVIDERS_REJECTED
} from "./inputActions";

const defaultProvidersState = {
	providers: [],
	request: {
		fetching: false,
		fetched: false,
		error: null
	}
};

export default function providersFetchReducer(state = defaultProvidersState, action) {
	switch (action.type) {
		case FETCH_PROVIDERS_PENDING:
			return {
				...state,
				request: {
					fetching: true,
					fetched: false,
					error: null
				}
			};
		case FETCH_PROVIDERS_FULFILLED:
			return {
				...state,
				providers: action.payload,
				request: {
					fetching: false,
					fetched: true,
					error: null
				}
			};
		case FETCH_PROVIDERS_REJECTED:
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
