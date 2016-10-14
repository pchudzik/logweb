import React from "react";
import td from "testdouble";
import {expect} from "chai";
import {shallow} from "enzyme";
import {noop} from "../../test/testHelper";
import {
	Log,
	__RewireAPI__ as LogRewireAPI
} from "./Log";

describe("Log.spec.jsx", () => {
	let scroll;
	let fetchInputDetails;
	let startFollowing;
	let stopFollowing;
	let dispatch;

	beforeEach(() => {
		fetchInputDetails = td.function();
		scroll = td.function();
		dispatch = td.function();
		startFollowing = td.function();
		stopFollowing = td.function();

		LogRewireAPI.__Rewire__("startFollowing", startFollowing);
		LogRewireAPI.__Rewire__("stopFollowing", stopFollowing);
		LogRewireAPI.__Rewire__("fetchInputDetails", fetchInputDetails);
		LogRewireAPI.__Rewire__("scroll", {
			animateScroll: {
				scrollToBottom: scroll
			}
		});
	});

	describe("log following toggle", () => {
		it("should toggle follow by default", () => {
			// given
			const options = {events: [], isFollowingActive: true};
			const element = createElement(options);

			// when
			element.setProps({events: [createEvent("first")]});

			// then
			td.verify(scroll(), {ignoreExtraArgs: true});
			expect(element.find("button")).to.have.className("active");
		});

		it("should stop scrolling to bottom when follow is disabled", () => {
			// given
			const options = {events: [], isFollowingActive: false};
			const element = createElement(options);

			// when
			element.find("button").simulate("click");
			element.setProps({events: [createEvent("first")]});

			// then
			td.verify(scroll(), {ignoreExtraArgs: true, times: 0});
			expect(element.find("button")).not.to.have.className("active");
		});
	});

	it("should dispatch start watching event on component mount", () => {
		// given
		const logName = "log name to follow";
		const startFollowingAction = "start following action";
		td.when(startFollowing(logName)).thenReturn(startFollowingAction);

		// when
		createElement({dispatch, logName});

		// then
		td.verify(dispatch(startFollowingAction));
	});

	it("should fetch input details on component mount", () => {
		// given
		const logName = "log-to-follow";
		const fetchInputDetailsActions = "fetch input details";
		td.when(fetchInputDetails(logName)).thenReturn(fetchInputDetailsActions);

		// when
		createElement({dispatch, logName});

		// then
		td.verify(dispatch(fetchInputDetailsActions));
	});

	it("should dispatch stop watching event on component unmount", () => {
		// given
		const logName = "following log name";
		const webSocket = {ws: "websocket to stop"};
		const stopFollowingAction = "stop following action";
		td.when(stopFollowing(logName, webSocket)).thenReturn(stopFollowingAction);
		const element = createElement({dispatch, logName, webSocket});

		// when
		element.unmount();

		// then
		td.verify(dispatch(stopFollowingAction));
	});

	it("should render all log events", () => {
		// given
		const event1 = createEvent("msg1");
		const event2 = createEvent("msg2");

		// when
		const element = createElement({events: [event1, event2]});

		// then
		const logs = element.find("LogEntry");
		expect(logs.length).to.eql(2);

		expect(logs.at(0)).to.have.prop("logMessage", event1.data);
		expect(logs.at(1)).to.have.prop("logMessage", event2.data);
	});

	function createElement(options) {
		const params = {
			logName: options.logName || "any log"
		};
		return shallow(
			<Log
				dispatch={options.dispatch || noop}
				events={options.events || []}
				webSocket={options.webSocket || {ws: "any websocket"}}
				isFollowingActive={options.isFollowingActive || false}
				params={params}/>, {lifecycleExperimental: true}
		);
	}

	function createEvent(data) {
		return {
			timestamp: new Date().getTime(),
			data
		};
	}
});
