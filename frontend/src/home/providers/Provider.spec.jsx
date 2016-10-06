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
		expect(element.find(".provider-name")).to.have.text(provider.name);
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
