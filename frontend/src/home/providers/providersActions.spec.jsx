import moxios from "moxios";
import td from "testdouble";
import {
	fetchProviders,
	FETCH_PROVIDERS_PENDING,
	FETCH_PROVIDERS_FULFILLED
} from "./providersActions";

describe("providersActions.spec.jsx", () => {
	let dispatchMock;

	beforeEach(() => {
		dispatchMock = td.function("dispatch mock");
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
		moxios.stubRequest("http://example.com/api/inputs", {
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
});
