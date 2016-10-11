const expect = require("chai").expect;

module.exports = {
	waitForEventsInOrder
};

function waitForEventsInOrder(done, observable, ...expectedEvents) {
	return observable.subscribe((event) => {
		const expectedEvent = expectedEvents.splice(0, 1)[0];
		expect(event).to.eql(expectedEvent);
		if (expectedEvents.length === 0) {
			done();
		}
	});
}
