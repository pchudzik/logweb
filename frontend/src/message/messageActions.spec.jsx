import {expect} from "chai";
import {addMessage} from "./messageActions";

describe("messageActions.spec.jsx", () => {
	it("should assign id to message", () => {
		// given
		const action = addMessage({message: "any message", type: "success"});

		// expect
		expect(action.payload.message).to.eql("any message");
		expect(action.payload.type).to.eql("success");
		expect(action.payload.id).to.be.number;		// eslint-disable-line no-unused-expressions
		expect(action.payload.id).to.be.greaterThan(0);
	});
});
