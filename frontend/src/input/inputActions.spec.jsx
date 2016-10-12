import moxios from "moxios";
import td from "testdouble";
import {
	__RewireAPI__ as InputActionsRewireAPI,
	fetchInputs,
	FETCH_INPUTS_PENDING,
	FETCH_INPUTS_FULFILLED,
	FETCH_INPUTS_REJECTED
} from "./inputActions";

describe("inputActions.spec.jsx", () => {
	let dispatchMock;
	let addMessageMock;

	beforeEach(() => {
		dispatchMock = td.function("dispatch mock");
		addMessageMock = td.function("add message mock");

		InputActionsRewireAPI.__Rewire__("addMessage", addMessageMock);

		moxios.install();
	});

	afterEach(() => {
		moxios.uninstall();
	});

	it(`should dispatch ${FETCH_INPUTS_PENDING} before list is fetched`, () => {
		// when
		fetchInputs()(dispatchMock);

		// then
		td.verify(dispatchMock({
			type: FETCH_INPUTS_PENDING
		}));
	});

	it(`should dispatch ${FETCH_INPUTS_FULFILLED} action when inputs list fetched`, done => {
		// given
		const responsePayload = [{name: "first"}, {name: "second"}];
		moxios.stubRequest("/api/inputs", {
			status: 200,
			response: responsePayload
		});

		// when
		fetchInputs()(dispatchMock);

		// then
		moxios.wait(() => {
			td.verify(dispatchMock({
				type: FETCH_INPUTS_FULFILLED,
				payload: responsePayload
			}));
			done();
		});
	});

	describe("promise rejection", () => {
		const errorMessage = "Internal server error";
		const errorStatus = 500;

		beforeEach(() => moxios.stubRequest("/api/inputs", {
			status: 500,
			responseText: "Internal server error"
		}));

		it("should dispatch promise rejection event on fetch failure", done => {
			// when
			fetchInputs()(dispatchMock);

			// then
			moxios.wait(() => {
				td.verify(dispatchMock(td.matchers.contains({
					type: FETCH_INPUTS_REJECTED,
					payload: {
						response: {
							status: errorStatus,
							data: errorMessage
						}
					}
				})));
				done();
			});
		});

		it("should call addMessage on promise fetch failure", done => {
			// when
			fetchInputs()(dispatchMock);

			// then
			moxios.wait(() => {
				td.verify(addMessageMock({
					type: "danger",
					message: `${errorStatus} - ${errorMessage}`
				}));
				done();
			});
		});
	});
});
