import React from "react";
import {shallow} from "enzyme";
import td from "testdouble";
import {expect} from "chai";
import {noop} from "../../test/testHelper";
import {
	Providers,
	__RewireAPI__ as ProvidersRewireAPI
} from "./Inputs";

describe("Inputs.spec.jsx", () => {
	const fetchProvidersMock = () => "fetch providers action";

	beforeEach(() => {
		ProvidersRewireAPI.__Rewire__("fetchProviders", fetchProvidersMock);
	});

	it("should dispatch fetch providers action on mount", () => {
		// given
		const dispatch = td.function();

		// when
		createElement({dispatch});

		// then
		td.verify(dispatch(fetchProvidersMock()));
	});

	it("should render all providers", () => {
		// given
		const providers = [createProvider("first"), createProvider("second")];

		// when
		const element = createElement({providers});

		// then
		const allProviders = element.find("ProviderItem");
		expect(allProviders).to.have.length(2);
		expect(allProviders.at(0)).to.have.prop("provider", providers[0]);
		expect(allProviders.at(1)).to.have.prop("provider", providers[1]);
	});

	function createElement(options) {
		return shallow(
			<Providers
				dispatch={options.dispatch || noop}
				providers={options.providers || []}/>
		);
	}

	function createProvider(name) {
		return {name};
	}
});
