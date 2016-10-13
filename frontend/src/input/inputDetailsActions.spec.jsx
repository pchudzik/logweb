import moxios from "moxios";
import td from "testdouble";
import {
	fetchInputDetails,
	FETCH_INPUT_DETAILS_PENDING,
	FETCH_INPUT_DETAILS_FULFILLED,
	FETCH_INPUT_DETAILS_REJECTED,
	__RewireAPI__ as InputDetailsActionsRewire
} from "./inputDetailsActions";

describe("inputDetailsActions.spec.jsx", () => {
	let dispatchMock;
	let dispatchErrorMessageMock;
	let httpErrorMessageMock;

	beforeEach(() => {
		moxios.install();

		dispatchMock = td.function("dispatch mock");
		dispatchErrorMessageMock = td.function();
		httpErrorMessageMock = td.function();

		InputDetailsActionsRewire.__Rewire__("dispatchErrorMessage", dispatchErrorMessageMock);
		InputDetailsActionsRewire.__Rewire__("httpErrorMessage", httpErrorMessageMock);
	});

	afterEach(() => {
		moxios.uninstall();
	});


	it(`should dispatch ${FETCH_INPUT_DETAILS_PENDING} when input details fetch starts`, () => {
		// given
		const inputName = "input-to-fetch";

		// when
		fetchInputDetails(inputName)(dispatchMock);

		// then
		td.verify(dispatchMock({
			type: FETCH_INPUT_DETAILS_PENDING
		}));
	});

	it(`should dispatch ${FETCH_INPUT_DETAILS_FULFILLED} when input details fetched`, done => {
		// given
		const inputName = "input-to-fetch";
		const inputDetails = {
			name: inputName,
			providers: ["provider 1", "proivider 2"]
		};
		moxios.stubRequest(`/api/inputs/${inputName}`, {
			status: 200,
			response: inputDetails
		});

		// when
		fetchInputDetails(inputName)(dispatchMock);

		// then
		moxios.wait(() => {
			td.verify(dispatchMock({
				type: FETCH_INPUT_DETAILS_FULFILLED,
				payload: inputDetails
			}));
			done();
		});
	});

	it(`should dispatch ${FETCH_INPUT_DETAILS_REJECTED} when input details fetch fails`, done => {
		// given
		const inputName = "input-to-fetch";
		const errorStatus = 500;
		const errorMessage = "Internal server error";
		moxios.stubRequest(`/api/inputs/${inputName}`, {
			status: errorStatus,
			responseText: errorMessage
		});

		// when
		fetchInputDetails(inputName)(dispatchMock);

		// then
		moxios.wait(() => {
			td.verify(dispatchMock(td.matchers.contains({
				type: FETCH_INPUT_DETAILS_REJECTED,
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

	it("should dispatch error message when input details fetch fails", done => {
		// given
		const inputName = "input-to-fetch";
		const errorMessage = "error message";
		td.when(httpErrorMessageMock(), {ignoreExtraArgs: true}).thenReturn(errorMessage);
		moxios.stubRequest(`/api/inputs/${inputName}`, {
			status: 500,
			responseText: errorMessage
		});

		// when
		fetchInputDetails(inputName)(dispatchMock);

		// then
		moxios.wait(() => {
			td.verify(dispatchErrorMessageMock(dispatchMock, errorMessage));
			done();
		});
	});
});
