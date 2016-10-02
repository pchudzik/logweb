import React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import td from "testdouble";
import {Messages} from "./Messages";
import {removeMessage} from "./messageActions";

describe("Messages.spec.jsx", () => {
	it("should render nothing when not messages", () => {
		// given
		const messages = createMessagesElement();

		// expect
		expect(messages.children().isEmpty()).to.eql(true);
	});

	it("should render all messages", () => {
		// given
		const msg1 = createMessage(1);
		const msg2 = createMessage(2);

		// when
		const messages = createMessagesElement({messages: [msg1, msg2]});

		// then
		expect(messages.find("MessageItem")).to.length(2);
	});

	it("should close selected message", () => {
		// given
		const dispatch = td.function();
		const messages = [createMessage(1)];
		const messagesElement = createMessagesElement({dispatch, messages});

		// when
		messagesElement.find("MessageItem").prop("dismiss")();

		// then
		td.verify(dispatch(removeMessage(messages[0])));
	});

	function createMessagesElement(options = {}) {
		const noop = () => {};
		return shallow(
			<Messages
				dispatch={options.dispatch || noop}
				messages={options.messages || []}/>
		);
	}

	function createMessage(id) {
		return {
			id,
			type: "success",
			message: `message ${id}`
		};
	}
});
