import React from "react";
import {shallow} from "enzyme";
import td from "testdouble";
import {expect} from "chai";
import {noop} from "../../test/testHelper";
import {
	Inputs,
	__RewireAPI__ as InputsRewireAPI
} from "./Inputs";

describe("Inputs.spec.jsx", () => {
	const fetchInputsMock = () => "fetch inputs action";

	beforeEach(() => {
		InputsRewireAPI.__Rewire__("fetchInputs", fetchInputsMock);
	});

	it("should dispatch fetch inputs action on mount", () => {
		// given
		const dispatch = td.function();

		// when
		createElement({dispatch});

		// then
		td.verify(dispatch(fetchInputsMock()));
	});

	it("should render all inputs", () => {
		// given
		const inputs = [createInput("first"), createInput("second")];

		// when
		const element = createElement({inputs});

		// then
		const allInputs = element.find("InputItem");
		expect(allInputs).to.have.length(2);
		expect(allInputs.at(0)).to.have.prop("input", inputs[0]);
		expect(allInputs.at(1)).to.have.prop("input", inputs[1]);
	});

	function createElement(options) {
		return shallow(
			<Inputs
				dispatch={options.dispatch || noop}
				inputs={options.inputs || []}/>
		);
	}

	function createInput(name) {
		return {name};
	}
});
