import {expect} from "chai";
import {
	START_FOLLOWING,
	STOP_FOLLOWING
} from "./logActions";
import logReducer from "./logReducer";

describe("logreducer.spec.jsx", () => {
	it("should empty initial state", () => {
		expect(
			logReducer(
				undefined,
				{type: "any action"}
			)
		).to.eql(
			{
				logName: null
			}
		);
	});

	it("should return input state on unknown event", () => {
		// given
		const inputState = {logName: "any log name"};

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

		// expect
		expect(
			logReducer(
				{logName: null},
				{type: START_FOLLOWING, payload: logName}
			)
		).to.eql(
			{logName}
		);
	});

	it(`should stop following log on ${STOP_FOLLOWING}`, () => {
		// given
		const logName = "following log";

		// epxect
		expect(
			logReducer(
				{logName},
				{type: STOP_FOLLOWING, payload: logName}
			)
		).to.eql(
			{logName: null}
		);
	});
});
