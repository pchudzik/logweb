import td from "testdouble";
import {expect} from "chai";
import {
	__RewireAPI__ as DispatchMessageRewireApi,
	httpErrorMessage,
	dispatchErrorMessage
} from "./dispatchMessage";

describe("dispatchMessage.spec.jsx", () => {
	let addMessageMock;
	let dispatchMock;

	beforeEach(() => {
		addMessageMock = td.function();
		dispatchMock = td.function();

		DispatchMessageRewireApi.__Rewire__("addMessage", addMessageMock);
	});

	it("should dispatch error message", () => {
		// given
		const error = "error message";

		// when
		dispatchErrorMessage(dispatchMock, error);

		// then
		td.verify(addMessageMock({
			type: "danger",
			message: error
		}));
	});

	it("should construct error string from http error", () => {
		// given
		const response = {
			status: 500,
			data: "Internal server error"
		};
		const error = {response};

		// expect
		expect(
			httpErrorMessage(error)
		).to.eql(
			`${response.status} - ${response.data}`
		);
	});
});
