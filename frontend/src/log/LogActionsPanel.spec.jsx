import React from "react";
import td from "testdouble";
import {shallow} from "enzyme";
import {expect} from "chai";
import {toggleFollowLog} from "./logActions";
import {
	LogActions as LogActionsPanel,
	__RewireAPI__ as LogActionsPanelRewireAPI
} from "./LogActionsPanel";

describe("LogActions.spec.jsx", () => {
	const toggleFollowAction = toggleFollowLog();

	let fetchInputDetailsMock;
	let dispatchMock;

	beforeEach(() => {
		dispatchMock = td.function("dispatch mock");
		fetchInputDetailsMock = td.function();

		LogActionsPanelRewireAPI.__Rewire__("fetchInputDetails", fetchInputDetailsMock);
	});

	it("should fetch input details on component mount", () => {
		// given
		const logName = "log-to-follow";
		const fetchInputDetailsActions = "fetch input details";
		td.when(fetchInputDetailsMock(logName)).thenReturn(fetchInputDetailsActions);

		// when
		createPanel({logName});

		// then
		td.verify(dispatchMock(fetchInputDetailsActions));
	});

	describe("toggle follow button", () => {
		it("should dispatch toggleFollow action when button clicked", () => {
			// given
			const panel = createPanel();

			// when
			panel.followButtonClick();

			// then
			td.verify(dispatchMock(toggleFollowAction));
		});

		it("should add active class to button when following", () => {
			// given
			const panel = createPanel({isFollowingActive: true});

			// expect
			expect(panel.followButton()).to.have.className("active");
		});

		it("should remove active class to button when not following", () => {
			// given
			const panel = createPanel({isFollowingActive: false});

			// expect
			expect(panel.followButton()).not.to.have.className("active");
		});
	});

	function createPanel(options = {}) {
		const panel = shallow(
			<LogActionsPanel
				isFollowingActive={options.isFollowingActive || false}
				logName={options.logName || "any-log-name"}
				dispatch={dispatchMock}/>,
			{lifecycleExperimental: true}
		);

		panel.followButton = () => panel.find(".btn-toggle-follow");
		panel.followButtonClick = () => panel.followButton().simulate("click");

		return panel;
	}
});
