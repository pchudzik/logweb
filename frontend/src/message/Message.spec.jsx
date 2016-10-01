import React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import td from "testdouble";
import Message from "./Message";

describe("Message.spec.jsx", () => {
	[
		"success",
		"info",
		"warning",
		"danger"
	].forEach(messageType => {
		it(`should generate valid item class for ${messageType}`, () => {
			// given
			const message = createMessageElement({messageType});

			// expect
			expect(message.find("div")).to.have.className(`alert alert-dismissible alert-${messageType}`);
		});
	});

	it("should display message content", () => {
		// given
		const messageContent = "message text to display";
		const message = createMessageElement({messageContent});

		// expect
		expect(message.find("span.message")).to.have.text(messageContent);
	});

	it("should dismiss message", () => {
		// given
		const dismissFunction = td.function("dismiss");
		const message = createMessageElement({dismissFunction});

		// when
		message.find("button").simulate("click");

		// then
		td.verify(dismissFunction());
	});

	function createMessageElement(options) {
		const noop = () => {
		};
		return shallow(
			<Message
				type={options.messageType || "success"}
				message={options.messageContent || "any message"}
				dismiss={options.dismissFunction || noop}/>
		);
	}
});
