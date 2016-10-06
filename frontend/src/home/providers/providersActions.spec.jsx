import moxios from "moxios";
import td from "testdouble";
import {
	__RewireAPI__ as ProvidersActionsRewireAPI,
	fetchProviders,
	FETCH_PROVIDERS_PENDING,
	FETCH_PROVIDERS_FULFILLED,
	FETCH_PROVIDERS_REJECTED
} from "./providersActions";

describe("providersActions.spec.jsx", () => {
	let dispatchMock;
	let addMessageMock;

	beforeEach(() => {
		dispatchMock = td.function("dispatch mock");
		addMessageMock = td.function("add message mock");

		ProvidersActionsRewireAPI.__Rewire__("addMessage", addMessageMock);

		moxios.install();
	});

	afterEach(() => {
		moxios.uninstall();
	});

	it(`should dispatch ${FETCH_PROVIDERS_PENDING} before list is fetched`, () => {
		// when
		fetchProviders()(dispatchMock);

		// then
		td.verify(dispatchMock({
			type: FETCH_PROVIDERS_PENDING
		}));
	});

	it(`should dispatch ${FETCH_PROVIDERS_FULFILLED} action when providers list fetched`, done => {
		// given
		const responsePayload = [{name: "first"}, {name: "second"}];
		moxios.stubRequest("/api/inputs", {
			status: 200,
			response: responsePayload
		});

		// when
		fetchProviders()(dispatchMock);

		// then
		moxios.wait(() => {
			td.verify(dispatchMock({
				type: FETCH_PROVIDERS_FULFILLED,
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
			fetchProviders()(dispatchMock);

			// then
			moxios.wait(() => {
				td.verify(dispatchMock(td.matchers.contains({
					type: FETCH_PROVIDERS_REJECTED,
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
			fetchProviders()(dispatchMock);

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
