const logSplitterFactory = require("./logSplitter");
const waitForEventsInOrder = require("../rxjs.spec-helper").waitForEventsInOrder;

describe("logSplitter.spec.js", () => {
	const newLinePattern = /(?=LOG:)/g;		// how to build smart regexp - http://stackoverflow.com/a/25221523
	const logAppendTimeout = 5000;

	it("should detect multiple lines from single string", done => {
		// given
		const splitter = createSplitter();
		const message1 = newLogMessage("line 1");
		const message2 = newLogMessage("line 2");
		const message3 = newLogMessage("line 3");

		// expect
		waitForEventsInOrder(
			done,
			splitter.observable,
			message1 + "\n", message2 + "\n", message3 + "\n"
		);

		// when
		splitter.appendText([message1, message2, message3].join("\n"));
		splitter.forceFlush();
	});

	it("should build single message from multiple text parts", done => {
		// given
		const splitter = createSplitter();
		const message1 = "first ";
		const message2 = "second ";
		const message3 = "third";

		// expect
		waitForEventsInOrder(
			done,
			splitter.observable,
			newLogMessage(message1 + message2 + message3) + "\n");

		// when
		splitter.appendText(newLogMessage(""));
		splitter.appendText(message1);
		splitter.appendText(message2);
		splitter.appendText(message3);
		splitter.forceFlush();
	});

	it("should flush buffer on new message arrival", done => {
		// given
		const splitter = createSplitter();
		const pendingMessage = "incomplete message";
		const newMessage = newLogMessage("new message");

		// expect
		waitForEventsInOrder(
			done,
			splitter.observable,
			pendingMessage + "\n", newMessage + "\n");

		// when
		splitter.appendText(pendingMessage);
		splitter.appendText(newMessage);
		splitter.forceFlush();
	});

	function createSplitter() {
		return logSplitterFactory(newLinePattern, logAppendTimeout);
	}

	function newLogMessage(messageText) {
		return "LOG: " + messageText;
	}
});
