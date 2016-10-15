import React from "react";
import td from "testdouble";
import {shallow} from "enzyme";
import {expect} from "chai";
import {noop} from "../../test/testHelper";
import ProvidersFilterToggle from "./ProvidersFilterToggle";

describe("ProvidersFilterToggle.spec.jsx", () => {
	it("should render toggle for each provider", () => {
		// given
		const providers = [provider("first"), provider("second")];

		// when
		const toggle = createToggle({providers});

		// then
		const toggles = toggle.toggles();
		expect(toggles.length).to.eql(2);
		expect(toggles.at(0)).to.have.text(providers[0].name);
		expect(toggles.at(1)).to.have.text(providers[1].name);
	});

	it("should assign active class to active provider", () => {
		// given
		const providers = [provider("first"), provider("second")];
		const providersFilter = ["second"];

		// when
		const toggle = createToggle({providers, providersFilter});

		// then
		const toggles = toggle.toggles();
		expect(toggles.at(0)).not.to.have.className("active");
		expect(toggles.at(1)).to.have.className("active");
	});

	it("should assign active class to all providers if none is selected", () => {
		// given
		const providers = [provider("first"), provider("second")];
		const providersFilter = [];

		// when
		const toggle = createToggle({providers, providersFilter});

		// then
		const toggles = toggle.toggles();
		expect(toggles.at(0)).to.have.className("active");
		expect(toggles.at(1)).to.have.className("active");
	});

	it("should call onToggleProvider callback on button click", () => {
		// given
		const providers = [provider("provider1"), provider("provider2")];
		const onToggleProvider = td.function();
		const toggle = createToggle({providers, onToggleProvider});

		// when
		toggle.toggles().at(0).simulate("click");

		// then
		td.verify(onToggleProvider(providers[0]));
	});

	[
		[],
		[provider("single provider")]
	].forEach(providers => {
		it("should hide providers toggle when only one provider present", () => {
			// given
			const toggle = createToggle({providers});

			// expect
			expect(toggle).to.be.blank();
		});
	});

	function createToggle(options = {}) {
		const toggle = shallow(<ProvidersFilterToggle
			providers={options.providers || []}
			providersFilter={options.providersFilter || []}
			onToggleProvider={options.onToggleProvider || noop}/>);

		toggle.toggles = () => toggle.find("button");

		return toggle;
	}

	function provider(name) {
		return {name};
	}
});
