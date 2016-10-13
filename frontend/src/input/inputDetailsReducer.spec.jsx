import {expect} from "chai";
import inputDetailsReducer from "./inputDetailsReducer";
import {errorRequest} from "./requestState";
import {
	FETCH_INPUT_DETAILS_PENDING,
	FETCH_INPUT_DETAILS_FULFILLED,
	FETCH_INPUT_DETAILS_REJECTED
} from "./inputDetailsActions";

describe("inputDetailsReducer.spec.jsx", () => {
	const anyRequestState = errorRequest("error");

	it("should return default state", () => {
		expect(
			inputDetailsReducer(
				undefined,
				"unknown action"
			)
		).to.eql({
			details: {
				name: null,
				providers: []
			},
			request: {
				fetching: false,
				fetched: false,
				error: null
			}
		});
	});

	it(`should handle ${FETCH_INPUT_DETAILS_FULFILLED} action`, () => {
		const newDetails = {name: "new details", providers: ["p1", "p2"]};
		const oldDetails = "old details";

		expect(
			inputDetailsReducer(
				{
					details: oldDetails,
					request: anyRequestState
				},
				{
					type: FETCH_INPUT_DETAILS_FULFILLED,
					payload: newDetails
				}
			)
		).to.eql({
			details: newDetails,
			request: {
				fetching: false,
				fetched: true,
				error: null
			}
		});
	});

	it(`should handle ${FETCH_INPUT_DETAILS_REJECTED} action`, () => {
		const details = "any details";
		const error = "fetch input details error message";

		expect(
			inputDetailsReducer(
				{
					details,
					request: anyRequestState
				},
				{
					type: FETCH_INPUT_DETAILS_REJECTED,
					payload: error
				}
			)
		).to.eql({
			details,
			request: {
				error,
				fetching: false,
				fetched: false
			}
		});
	});

	it(`should handle ${FETCH_INPUT_DETAILS_PENDING} action`, () => {
		const anyDetails = "any details";

		expect(
			inputDetailsReducer(
				{
					details: anyDetails,
					request: anyRequestState
				},
				{type: FETCH_INPUT_DETAILS_PENDING}
			)
		).to.eql({
			details: anyDetails,
			request: {
				fetching: true,
				fetched: false,
				error: null
			}
		});
	});
});
