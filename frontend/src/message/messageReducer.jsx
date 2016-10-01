import {
	ADD_MESSAGE,
	REMOVE_MESSAGE
} from "./messageActions";

export default function errorReducer(state = [], action) {
	switch (action.type) {
		case ADD_MESSAGE:
			return [action.payload, ...state];
		case REMOVE_MESSAGE:
			return state.filter(error => error.id !== action.payload.id);
		default:
			return state;
	}
}
