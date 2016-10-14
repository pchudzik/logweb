import {expect} from "chai";
import {
	START_FOLLOWING,
	STOP_FOLLOWING,
	TOGGLE_FOLLOW_LOG,
	LOG_EVENT
} from "./logActions";
import logReducer from "./logReducer";

describe("logreducer.spec.jsx", () => {
	const emptyFilter = {providers: []};
	const anyFilter = {
		providers: ["filter"]
	};

	it("should empty initial state", () => {
		expect(
			logReducer(
				undefined,
				{type: "any action"}
			)
		).to.eql(
			{
				logName: null,
				webSocket: null,
				events: [],
				filter: emptyFilter,
				isFollowingActive: false
			}
		);
	});

	it("should return input state on unknown event", () => {
		// given
		const inputState = {
			logName: "any log name",
			webSocket: "any websocket",
			events: [1, 2, 3],
			filter: anyFilter
		};

		// expect
		expect(
			logReducer(
				inputState,
				{type: "unknown action"}
			)
		).to.eql(
			inputState
		);
	});

	it(`should start following on ${START_FOLLOWING}`, () => {
		// given
		const logName = "start following logxx";
		const webSocket = "log websocket";

		// expect
		expect(
			logReducer(
				{logName: null},
				{
					type: START_FOLLOWING,
					payload: {
						logName,
						webSocket,
						filter: anyFilter
					}
				}
			)
		).to.eql(
			{
				events: [],
				logName,
				webSocket,
				filter: emptyFilter,
				isFollowingActive: true
			}
		);
	});

	it(`should stop following log on ${STOP_FOLLOWING}`, () => {
		// given
		const logName = "following log";

		// expect
		expect(
			logReducer(
				{logName, webSocket: "any websocket"},
				{
					type: STOP_FOLLOWING,
					payload: {
						logName,
						webSocket: null,
						filter: anyFilter,
						isFollowingActive: true
					}
				}
			)
		).to.eql(
			{
				logName: null,
				webSocket: null,
				events: [],
				filter: emptyFilter,
				isFollowingActive: false
			}
		);
	});

	it(`should add new event on ${LOG_EVENT}`, () => {
		// given
		const logName = "any log name";
		const webSocket = "any web socket";
		const existingEvent = [{timestamp: 1234, message: "msg1"}];
		const event = {timestamp: 4566, message: "msg2"};

		// expect
		expect(
			logReducer(
				{
					logName,
					webSocket,
					events: [existingEvent],
					filter: anyFilter,
					isFollowingActive: "any value"
				},
				{
					type: LOG_EVENT,
					payload: {data: JSON.stringify(event)}
				}
			)
		).to.eql({
			logName,
			webSocket,
			events: [existingEvent, event],
			filter: anyFilter,
			isFollowingActive: "any value"
		});
	});

	[true, false].forEach(isFollowing => {
		const isStart = isFollowing ? "stop" : "start";
		it(`should ${isStart} log pursuit on ${TOGGLE_FOLLOW_LOG} action when isFollowing = ${isFollowing}`, () => {
			const logName = "any log name";
			const webSocket = "any web socket";
			const events = [{timestamp: 1234, message: "message"}];

			expect(
				logReducer(
					{
						logName,
						webSocket,
						events,
						isFollowingActive: isFollowing
					},
					{type: TOGGLE_FOLLOW_LOG}
				)
			).to.eql({
				logName,
				webSocket,
				events,
				isFollowingActive: !isFollowing
			});
		});
	});
});
