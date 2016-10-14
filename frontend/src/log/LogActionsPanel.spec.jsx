import React from "react";
import td from "testdouble";
import {shallow} from "enzyme";
import {expect} from "chai";
import {toggleFollowLog} from "./logActions";
import {LogActions as LogActionsPanel} from "./LogActionsPanel";

describe("LogActions.spec.jsx", () => {
	const toggleFollowAction = toggleFollowLog();

	let dispatchMock;

	beforeEach(() => {
		dispatchMock = td.function("dispatch mock");
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
		const panel = shallow(<LogActionsPanel
			isFollowingActive={options.isFollowingActive || false}
			dispatch={dispatchMock}/>);

		panel.followButton = () => panel.find(".toggle-follow");
		panel.followButtonClick = () => panel.followButton().simulate("click");

		return panel;
	}
});
