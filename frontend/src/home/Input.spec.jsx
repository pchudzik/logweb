import React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import Input from "./Input";

describe("Input.spec.jsx", () => {
	it("should render input name in first column", () => {
		// given
		const input = createInput("input name");

		// when
		const element = createInputElement(input);

		// then
		expect(element.find("Link").html()).to.eql(`<a>${input.name}</a>`);	// .text() doesn't work
	});

	it("should go to log following page on click", () => {
		// given
		const input = createInput("input-name");

		// when
		const element = createInputElement(input);

		// then
		expect(element.find("Link")).to.have.prop("to", `/log/${input.name}`);
	});

	function createInputElement(input) {
		return shallow(
			<Input input={input} />
		);
	}

	function createInput(name) {
		return {name};
	}
});
