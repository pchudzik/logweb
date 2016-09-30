import React from "react";
import { expect } from "chai";
import { shallow, mount } from "enzyme";
import SampleComponent from "./SampleComponent";

describe("SampleComponent.spec.jsx", () => {
	it("shallow test", () => {
		expect(shallow(<SampleComponent />).find("h1")).to.have.text("Hello World!");
	});

	it("mount test", () => {
		// given
		const message = "any message";

		// expect
		expect(mount(<SampleComponent msg="any message" />).find("#message")).to.contain.text(`"${message}"`);
	});

	it("should render default message", () => {
		expect(shallow(<SampleComponent />).find("#message")).to.have.text("Message is \"default message\"");
	});
});
