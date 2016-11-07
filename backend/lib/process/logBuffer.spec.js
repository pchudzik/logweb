const Subject = require("rxjs").Subject;
const logBufferFactory = require("./logBuffer");
const waitForEventsInOrder = require("../rxjs.spec-helper").waitForEventsInOrder;

describe("logBuffer.spec.js", () => {
	const flushInterval = 10;
	let processor;
	let logBuffer;

	beforeEach(() => {
		const observable = new Subject();
		processor = {
			appendText: data => observable.next(data),
			observable
		};

		logBuffer = logBufferFactory(flushInterval, processor);
	});

	it("should buffer output observable", done => {
		waitForEventsInOrder(done, logBuffer.observable, ["1", "2", "3"]);

		logBuffer.appendText("1");
		logBuffer.appendText("2");
		logBuffer.appendText("3");
	});

	it("should filter out empty array", done => {
		waitForEventsInOrder(done, logBuffer.observable, ["1", "2"]);

		setTimeout(() => {
			logBuffer.appendText("1");
			logBuffer.appendText("2");
		}, 20);
	});
});
