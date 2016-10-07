import React from "react";
import td from "testdouble";
import {shallow} from "enzyme";
import {noop} from "../../test/testHelper";
import {
	Log,
	__RewireAPI__ as LogRewireAPI
} from "./Log";

describe("Log.spec.jsx", () => {
	let startFollowing;
	let stopFollowing;
	let dispatch;

	beforeEach(() => {
		dispatch = td.function();
		startFollowing = td.function();
		stopFollowing = td.function();

		LogRewireAPI.__Rewire__("startFollowing", startFollowing);
		LogRewireAPI.__Rewire__("stopFollowing", stopFollowing);
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

	it("should dispatch stop watching event on component unmount", () => {
		// given
		const logName = "following log name";
		const stopFollowingAction = "stop following action";
		td.when(stopFollowing(logName)).thenReturn(stopFollowingAction);
		const element = createElement({dispatch, logName});

		// when
		element.unmount();

		// then
		td.verify(dispatch(stopFollowingAction));
	});

	function createElement(options) {
		const params = {
			logName: options.logName || "any log"
		};
		return shallow(
			<Log
				dispatch={options.dispatch || noop}
				params={params} />
		);
	}
});
