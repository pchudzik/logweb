import React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {Navigation} from "./Navigation";

describe("Navigation.spc.jsx", () => {
	it("should render following log name in header", () => {
		// given
		const logName = "log to follow";

		// when
		const element = createElement(logName);

		// then
		expect(element.find("p.navbar-text")).to.contain.text(logName);
	});

	it("should render nothing in header when not following", () => {
		// when
		const element = createElement(null);

		// then
		expect(element.find("p.navbar-text")).to.have.length(0);
	});

	function createElement(logName) {
		return shallow(<Navigation logName={logName} />);
	}
});
