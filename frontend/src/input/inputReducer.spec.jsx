import {expect} from "chai";
import providersReducer from "./inputReducer";
import {
	FETCH_PROVIDERS_PENDING,
	FETCH_PROVIDERS_FULFILLED,
	FETCH_PROVIDERS_REJECTED
} from "./inputActions";

describe("inputReducer.spec.js", () => {
	const oldProviders = ["old", "providers", "collection"];

	it("should return default state", () => {
		expect(providersReducer(undefined, "unknown action")).to.eql({
			providers: [],
			request: {
				fetching: false,
				fetched: false,
				error: null
			}
		});
	});

	it(`should handle ${FETCH_PROVIDERS_PENDING} action`, () => {
		expect(
			providersReducer({
				providers: oldProviders,
				request: {
					fetching: false,
					fetched: true,
					error: "any error"
				}
			}, {type: FETCH_PROVIDERS_PENDING})
		).to.eql(
			{
				providers: oldProviders,
				request: {
					fetching: true,
					fetched: false,
					error: null
				}
			}
		);
	});

	it(`should handle ${FETCH_PROVIDERS_FULFILLED} action`, () => {
		// given
		const newProviders = ["new", "providers", "collection"];

		// expect
		expect(
			providersReducer({
				providers: oldProviders,
				request: {
					fetching: true,
					fetched: false,
					error: "any error"
				}
			}, {type: FETCH_PROVIDERS_FULFILLED, payload: newProviders})
		).to.eql(
			{
				providers: newProviders,
				request: {
					fetching: false,
					fetched: true,
					error: null
				}
			}
		);
	});

	it(`should handle ${FETCH_PROVIDERS_REJECTED} action`, () => {
		// given
		const error = "fetch providers failure!";

		// expect
		expect(
			providersReducer({
				providers: oldProviders,
				request: {
					fetching: false,
					fetched: true,
					error: null
				}
			}, {type: FETCH_PROVIDERS_REJECTED, payload: error})
		).to.eql(
			{
				providers: oldProviders,
				request: {
					error,
					fetching: false,
					fetched: false
				}
			}
		);
	});
});
