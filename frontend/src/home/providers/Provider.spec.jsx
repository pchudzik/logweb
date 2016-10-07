import React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import Provider from "./Provider";

describe("Provider.spec.jsx", () => {
	it("should render provider name in first column", () => {
		// given
		const provider = createProvider("provider name");

		// when
		const element = createProviderElement(provider);

		// then
		expect(element.find("Link").html()).to.eql(`<a>${provider.name}</a>`);	// .text() doesn't work
	});

	it("should go to log following page on click", () => {
		// given
		const provider = createProvider("provider-name");

		// when
		const element = createProviderElement(provider);

		// then
		expect(element.find("Link")).to.have.prop("to", `/log/${provider.name}`);
	});

	function createProviderElement(provider) {
		return shallow(
			<Provider provider={provider} />
		);
	}

	function createProvider(name) {
		return {name};
	}
});
