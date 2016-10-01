import {expect} from "chai";
import errorReducer from "./messageReducer";
import {
	ADD_MESSAGE,
	removeMessage
} from "./messageActions";


describe("messageReducer.spec.jsx", () => {
	it("should return empty initial state", () => {
		expect(errorReducer(undefined, {})).to.eql([]);
	});

	it("should return input state on unknown action", () => {
		const inputState = "input state";

		expect(errorReducer(inputState, {type: "uknown action type"})).to.eql(inputState);
	});

	it("should add error at the begging of error queue", () => {
		// given
		const firstError = newError("first");
		const secondError = newError("second");
		const errorToAddError = newError("third");

		// when
		const errorQueue = errorReducer(
			[firstError, secondError],
			{type: ADD_MESSAGE, payload: errorToAddError});

		// then
		expect(errorQueue).to.eql([errorToAddError, firstError, secondError]);
	});

	it("should remove error from queue", () => {
		// given
		const firstError = newError(1);
		const secondError = newError(2);
		const thirdError = newError(3);

		// when
		const errorQueue = errorReducer(
			[firstError, secondError, thirdError],
			removeMessage(secondError));

		// then
		expect(errorQueue).to.eql([firstError, thirdError]);
	});

	function newError(id) {
		return {
			id,
			error: `error ${id}`
		};
	}
});
