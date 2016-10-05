import React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import td from "testdouble";
import {
	Messages,
	__RewireAPI__ as MessagesRewireAPI
} from "./Messages";

describe("Messages.spec.jsx", () => {
	let removeMessageMock;

	beforeEach(() => {
		removeMessageMock = td.function();
		MessagesRewireAPI.__Rewire__("removeMessage", removeMessageMock);
	});

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
		const removeMessageAction = "remove message acction";
		const dispatch = td.function();
		const messages = [createMessage(1)];
		const messagesElement = createMessagesElement({dispatch, messages});
		td.when(removeMessageMock(messages[0])).thenReturn(removeMessageAction);

		// when
		messagesElement.find("MessageItem").prop("dismiss")();

		// then
		td.verify(dispatch(removeMessageAction));
	});

	function createMessagesElement(options = {}) {
		const noop = () => {
		};
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
