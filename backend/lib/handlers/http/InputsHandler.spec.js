const express = require("express");
const _ = require("lodash");

const td = require("testdouble");
const proxyquire = require("proxyquire");
const request = require("supertest");

describe("InputsHandler.spec.js", () => {
	const configurationMock = {
		"@noCallThru": true,
		getInputs: td.function()
	};

	let app;

	before(() => {
		const InputsHandler = proxyquire(
			"./InputsHandler",
			{"../../configuration": configurationMock}
		);
		const inputsHandler = new InputsHandler();
		app = express();
		inputsHandler.setup(app);
	});

	beforeEach(td.reset);

	it("should list all inputs", done => {
		// given
		configurationMock.getInputs = _.constant([
			{name: "first input", otherProperty: "value"},
			{name: "second input", otherProperty: "value"}
		]);

		// when
		request(app).get("/api/inputs")

		// then
			.expect("Content-Type", /json/)
			.expect(200, [
				{name: "first input"},
				{name: "second input"}
			])
			.end(done);
	});

	it("should get input details", done => {
		// given
		const inputName = "input-to-find";
		const otherProperty = "otherProperty";
		configurationMock.getInputs = _.constant([
			{name: "other"},
			{
				name: inputName,
				otherProperty,
				providers: [
					{name: "provider1", otherProperty},
					{name: "provider2", otherProperty}
				]
			}
		]);

		// when
		request(app).get(`/api/inputs/${inputName}`)

		// then
			.expect("Content-Type", /json/)
			.expect(200, {
				name: inputName,
				providers: [
					{name: "provider1"},
					{name: "provider2"}
				]
			})
			.end(done);
	});

	it("should return 404 status when input not found", done => {
		// given
		const nonExistingInput = "non-existing-input";
		configurationMock.getInputs = () => [];

		// when
		request(app).get(`/api/inputs/${nonExistingInput}`)

		// then
			.expect("Content-Type", /json/)
			.expect(404, {
				error: `No input with name ${nonExistingInput}`
			})
			.end(done);
	});
});
