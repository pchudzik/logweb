import {expect} from "chai";
import inputReducer from "./inputReducer";
import {
	FETCH_INPUTS_PENDING,
	FETCH_INPUTS_FULFILLED,
	FETCH_INPUTS_REJECTED
} from "./inputActions";

describe("inputReducer.spec.js", () => {
	const oldInputs = ["old", "inputReducer", "collection"];

	it("should return default state", () => {
		expect(
			inputReducer(
				undefined,
				"unknown action"
			)
		).to.eql({
			inputs: [],
			request: {
				fetching: false,
				fetched: false,
				error: null
			}
		});
	});

	it(`should handle ${FETCH_INPUTS_PENDING} action`, () => {
		expect(
			inputReducer({
				inputs: oldInputs,
				request: {
					fetching: false,
					fetched: true,
					error: "any error"
				}
			}, {type: FETCH_INPUTS_PENDING})
		).to.eql(
			{
				inputs: oldInputs,
				request: {
					fetching: true,
					fetched: false,
					error: null
				}
			}
		);
	});

	it(`should handle ${FETCH_INPUTS_FULFILLED} action`, () => {
		// given
		const newInputs = ["new", "inputReducer", "collection"];

		// expect
		expect(
			inputReducer({
				inputs: oldInputs,
				request: {
					fetching: true,
					fetched: false,
					error: "any error"
				}
			}, {type: FETCH_INPUTS_FULFILLED, payload: newInputs})
		).to.eql(
			{
				inputs: newInputs,
				request: {
					fetching: false,
					fetched: true,
					error: null
				}
			}
		);
	});

	it(`should handle ${FETCH_INPUTS_REJECTED} action`, () => {
		// given
		const error = "fetch inputs failure!";

		// expect
		expect(
			inputReducer({
				inputs: oldInputs,
				request: {
					fetching: false,
					fetched: true,
					error: null
				}
			}, {type: FETCH_INPUTS_REJECTED, payload: error})
		).to.eql(
			{
				inputs: oldInputs,
				request: {
					error,
					fetching: false,
					fetched: false
				}
			}
		);
	});
});
