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
	let dispatchErrorMessageMock;
	let httpErrormessageMock;

	beforeEach(() => {
		httpErrormessageMock = td.function("httpErrorMessage");
		dispatchMock = td.function("dispatch mock");
		dispatchErrorMessageMock = td.function("dispatch error message mock");

		InputActionsRewireAPI.__Rewire__("dispatchErrorMessage", dispatchErrorMessageMock);
		InputActionsRewireAPI.__Rewire__("httpErrorMessage", httpErrormessageMock);

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

		it("should dispatch error message on promise fetch failure", done => {
			// given
			td.when(httpErrormessageMock(), {ignoreExtraArgs: true}).thenReturn(errorMessage);

			// when
			fetchInputs()(dispatchMock);

			// then
			moxios.wait(() => {
				td.verify(dispatchErrorMessageMock(dispatchMock, errorMessage));
				done();
			});
		});
	});
});
