import {expect} from "chai";
import eventsFilter from "./eventsFilter";

describe("eventsFilter.spec.jsx", () => {
	it("should filter nothing when no filters defined", () => {
		// given
		const filter = {providers: []};
		const event1 = newEvent("provider1");
		const event2 = newEvent("provider2");

		// when
		const events = eventsFilter(
			[event1, event2],
			filter);

		// then
		expect(events).to.eql([event1, event2]);
	});

	it("should filter by provider name", () => {
		// given
		const provider = "provider1";
		const filter = {
			providers: [provider]
		};
		const event1 = newEvent(provider);
		const event2 = newEvent("other provider");
		const event3 = newEvent(provider);

		// when
		const events = eventsFilter(
			[event1, event2, event3],
			filter);

		// then
		expect(events).to.eql([event1, event3]);
	});

	function newEvent(providerName) {
		return {providerName};
	}
});
